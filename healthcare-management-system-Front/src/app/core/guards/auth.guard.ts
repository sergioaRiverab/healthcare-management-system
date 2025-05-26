import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      // Espera a que el usuario se cargue (no sea null ni undefined)
      filter(user => user !== undefined), // o ajusta según inicialización
      take(1), // solo la primera emisión válida
      map(user => {
        if (user) {
          return true;
        }
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}
