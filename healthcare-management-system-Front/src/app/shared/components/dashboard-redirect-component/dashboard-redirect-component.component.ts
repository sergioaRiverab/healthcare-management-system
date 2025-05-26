import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  template: `<p>Redirigiendo...</p>`
})
export class DashboardRedirectComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Iniciando redirección al dashboard del usuario...');
    const user = this.authService.getCurrentUser();
    console.log('Redirigiendo al dashboard del usuario:', user);
    console.log(user?.role === 'Patient' ? 1 : 0);
    if (user?.role === 'Patient') {
      this.router.navigate(['/patient/dashboard']);
    } else if (user?.role === 'Pharmacy') {
      this.router.navigate(['/pharmacy/dashboard']);
    } else {
      this.router.navigate(['/']); // fallback
    }
  }
}
