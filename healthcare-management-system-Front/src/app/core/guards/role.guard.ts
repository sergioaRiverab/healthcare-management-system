import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'];
  const userRole = authService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  }

  // Redirigir según el rol del usuario
  if (userRole === 'Pharmacy') {
    router.navigate(['/pharmacy/dashboard']);
  } else if (userRole === 'Patient') {
    router.navigate(['/patient/dashboard']);
  } else {
    router.navigate(['/']);
  }
  
  return false;
}; 