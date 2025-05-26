import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const allowedRoles = route.data['roles'] as Array<string>;

    return this.authService.user$.pipe(
      filter(user => user !== undefined), // Espera que usuario esté cargado
      take(1), // Solo la primera emisión válida
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
