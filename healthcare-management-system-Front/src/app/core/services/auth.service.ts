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

  private loadUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', response.accessToken);

          const user = this.decodeToken(response.accessToken);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
          }
        }
      }),
      catchError((error) => {
        console.error('Error detectado en el backend:', error);

        let errorMessage = 'Ocurrió un problema al iniciar sesión. Intenta nuevamente más tarde.';

        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
        } else if (error.error && typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }


  register(user: { username: string; email: string; password: string; role: string; phone?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role || null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
