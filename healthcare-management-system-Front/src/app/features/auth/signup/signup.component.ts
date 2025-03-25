import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import  {AuthService} from '../../../core/services/auth.service';




@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router, private authService: AuthService,) {
    this.signUpForm = this.fb.group({
      userType: ['Patient', Validators.required],
      name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [
              Validators.required,
              Validators.maxLength(20),
              Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value;
      formData.email = formData.email.toLowerCase();
      formData.phone = formData.phone.toString(); 

      this.authService.register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.userType,
        phone: formData.phone
      }).subscribe({
        next: () => {
          alert('Registro exitoso');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('Error en el registro');
        }
      });
    } else {
      alert('Formulario inválido');
    }
  }

}
