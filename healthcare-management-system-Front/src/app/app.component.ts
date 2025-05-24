import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, UserProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'healthcare-management-system';
  isDashboardRoute = false;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        const role = user.role;
        const currentPath = window.location.pathname;
        
        // Si estamos en la página principal o en rutas de autenticación, redirigir al dashboard correspondiente
        if (currentPath === '/' || currentPath.startsWith('/auth/')) {
          if (role === 'Pharmacy') {
            this.router.navigate(['/pharmacy/dashboard']);
          } else if (role === 'Patient') {
            this.router.navigate(['/patient/dashboard']);
          }
        }
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkIfDashboardRoute();
    });

    this.checkIfDashboardRoute(); // Initial check
  }

  checkIfDashboardRoute() {
    const currentRoute = this.router.url;
    this.isDashboardRoute = currentRoute.includes('/patient/dashboard') || currentRoute.includes('/pharmacy/dashboard');
  }
}
