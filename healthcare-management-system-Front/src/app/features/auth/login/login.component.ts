import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { RouterLink,Router  } from '@angular/router';
import { CommonModule } from '@angular/common';
import  {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]],
      rememberMe: [false]
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
  

}
