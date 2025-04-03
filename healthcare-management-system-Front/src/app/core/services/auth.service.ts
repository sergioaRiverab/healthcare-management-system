import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/User.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth'; 
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser(): void {
    this.getProfile().subscribe({
      next: (user: User) => this.userSubject.next(user),
      error: () => this.userSubject.next(null)
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`, 
      { email, password }, 
      { withCredentials: true } 
    ).pipe(
      tap(() => {
        this.getProfile().subscribe({
          next: (user: User) => this.userSubject.next(user),
          error: () => this.userSubject.next(null)
        });
      }),
      catchError((error) => {
        let errorMessage = 'Ocurrió un problema al iniciar sesión.';
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas.';
        } else if (error.error && typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: { 
    username: string; 
    email: string; 
    password: string; 
    role: string; 
    phone?: string; 
    dob?: string; 
    address?: string; 
    medicalHistory?: string; 
    specialty?: string; 
    schedule?: string 
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user, { withCredentials: true });
  }

  // Cierra la sesión; se borra la cookie en el backend
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.userSubject.next(null);
      });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  editProfile(updateProfileData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile`, updateProfileData, { withCredentials: true })
      .pipe(
         tap(() => {
            this.getProfile().subscribe({
              next: (user: User) => this.userSubject.next(user),
              error: () => this.userSubject.next(null)
            });
         })
      );
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
    if (!this.userSubject.value) {
      return throwError(() => new Error('Debe iniciar sesión para cambiar la contraseña'));
    }

    return this.http.post(`${this.apiUrl}/change-password`, data, { 
      withCredentials: true 
    }).pipe(
      catchError((error) => {
        let errorMessage = 'Error al cambiar la contraseña.';
        if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
          this.userSubject.next(null);
        } else if (error.error && typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role || null;
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data, { 
      withCredentials: true 
    }).pipe(
      catchError((error) => {
        let errorMessage = 'Error al restablecer la contraseña.';
        if (error.error && typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
