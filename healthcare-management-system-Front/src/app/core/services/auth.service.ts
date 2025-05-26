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

  // Inicializamos con undefined para indicar "aún cargando"
  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  private currentUser: User | null | undefined = undefined;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser(): void {
    this.getProfile().subscribe({
      next: (user: User) => {
        this.userSubject.next(user);
        this.currentUser = user;
      },
      error: () => {
        this.userSubject.next(null);
        this.currentUser = null;
      }
    });
  }

  public reloadUser(): void {
    this.loadUser();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`, 
      { email, password }, 
      { withCredentials: true } 
    ).pipe(
      tap(() => this.loadUser()),
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
    lat?: number; 
    lng?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user, { withCredentials: true });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.userSubject.next(null);
        this.currentUser = null;
      });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  editProfile(data: { 
    username?: string; 
    email?: string; 
    phone?: string; 
    dob?: string; 
    address?: string; 
    lat?: number; 
    lng?: number;
  }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, data, { withCredentials: true });
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
    if (!this.currentUser) {
      return throwError(() => new Error('Debe iniciar sesión para cambiar la contraseña'));
    }

    return this.http.post(`${this.apiUrl}/change-password`, data, { withCredentials: true })
      .pipe(
        catchError((error) => {
          let errorMessage = 'Error al cambiar la contraseña.';
          if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
            this.userSubject.next(null);
            this.currentUser = null;
          } else if (error.error && typeof error.error.message === 'string') {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getCurrentUser(): User | null | undefined {
    return this.currentUser;
  }

  getUserRole(): string | null | undefined {
    return this.currentUser?.role || null;
  }
}
