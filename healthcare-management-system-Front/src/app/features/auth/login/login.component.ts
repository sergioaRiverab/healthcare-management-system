import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isChangePasswordModalOpen = false;
  changePasswordForm: FormGroup;
  isAuthenticated = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]],
      rememberMe: [false]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]],
    });

    // Suscribirse al estado de autenticación
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      formData.email = formData.email.toLowerCase();

      this.authService.login(formData.email, formData.password).subscribe({
        next: () => {
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (err: Error) => {
          console.error('Error en el inicio de sesión:', err.message);
          alert(err.message);
        }
      });
    }
  }

  openChangePasswordModal(event: Event) {
    event.preventDefault();
    if (!this.isAuthenticated) {
      alert('Debe iniciar sesión para cambiar la contraseña');
      return;
    }
    this.isChangePasswordModalOpen = true;
    this.changePasswordForm.reset();
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
    this.changePasswordForm.reset();
  }

  onChangePassword() {
    if (!this.isAuthenticated) {
      alert('Debe iniciar sesión para cambiar la contraseña');
      this.closeChangePasswordModal();
      return;
    }

    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      
      this.authService.changePassword({ oldPassword, newPassword }).subscribe({
        next: () => {
          alert('Contraseña cambiada exitosamente');
          this.closeChangePasswordModal();
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          if (err.message.includes('No autorizado')) {
            this.router.navigate(['/auth/login']);
          }
          alert(err.message || 'Error al cambiar la contraseña');
        },
      });
    } else {
      alert('Por favor, complete todos los campos correctamente');
    }
  }
}