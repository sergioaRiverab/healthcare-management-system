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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.signUpForm = this.fb.group({
      userType: ['Patient', Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [
        Validators.required,
        Validators.maxLength(20),
        // La expresión regular para validar la contraseña:
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/)
      ]],
      terms: [false, Validators.requiredTrue],
      // Campos adicionales:
      specialty: [''],
      schedule: [''],
      dob: [''],
      address: [''],
      medicalHistory: ['']
    });

    this.signUpForm.get('userType')?.valueChanges.subscribe((value) => {
      if (value === 'Doctor') {
        this.signUpForm.get('specialty')?.setValidators([Validators.required]);
        this.signUpForm.get('schedule')?.setValidators([Validators.required]);
        // Remover validadores de campos de Patient
        this.signUpForm.get('dob')?.clearValidators();
        this.signUpForm.get('address')?.clearValidators();
        this.signUpForm.get('medicalHistory')?.clearValidators();
      } else if (value === 'Patient') {
        this.signUpForm.get('dob')?.setValidators([Validators.required]);
        this.signUpForm.get('address')?.setValidators([Validators.required]);
        this.signUpForm.get('medicalHistory')?.setValidators([Validators.required]);
        // Remover validadores de campos de Doctor
        this.signUpForm.get('specialty')?.clearValidators();
        this.signUpForm.get('schedule')?.clearValidators();
      }
      // Actualizar el estado de validación de cada control
      this.signUpForm.get('specialty')?.updateValueAndValidity();
      this.signUpForm.get('schedule')?.updateValueAndValidity();
      this.signUpForm.get('dob')?.updateValueAndValidity();
      this.signUpForm.get('address')?.updateValueAndValidity();
      this.signUpForm.get('medicalHistory')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value;
      
      // Prepara los datos como el backend los espera
      const requestData = {
        username: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.userType,
        phone: String(formData.phone),
        ...(formData.userType === 'Doctor' && {
          specialty: formData.specialty.trim(),
          schedule: formData.schedule.trim()
        }),
        ...(formData.userType === 'Patient' && {
          dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '',
          address: formData.address.trim(),
          medicalHistory: formData.medicalHistory.trim()
        })
      };
  
      this.authService.register(requestData).subscribe({
        next: () => {
          alert('Registro exitoso!');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Detalles del error:', err.error);
          
          if (err.error && err.error.message) {
            if (Array.isArray(err.error.message)) {
              alert(`Error en el registro:\n${err.error.message.join('\n')}`);
            } 
            else if (typeof err.error.message === 'string') {
              alert(`Error en el registro: ${err.error.message}`);
            }
            else {
              alert(`Error en el registro: ${err.error.error || 'Error desconocido'}`);
            }
          } else {
            alert('Error en el registro: Por favor verifica tus datos');
          }
        }
      });
    }
  }
}
