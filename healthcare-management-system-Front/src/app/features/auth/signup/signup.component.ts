// src/app/features/auth/signup/signup.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  private map: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signUpForm = this.fb.group({
      userType: ['Patient', Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      // Patient
      dob: [''],
      address: [''],
      // Pharmacy
      pharmacyName: [''],
      pharmacyPhone: ['', Validators.pattern('^[0-9]{10}$')],
      pharmacyAddress: [''],
      lat: [null],
      lng: [null],
      // Credentials
      password: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/)
      ]],
      terms: [false, Validators.requiredTrue]
    });

    // Ajuste dinámico de validadores según tipo
    this.signUpForm.get('userType')!.valueChanges.subscribe(value => {
      const extras = [
        'dob','address',
        'pharmacyName','pharmacyPhone','pharmacyAddress','lat','lng'
      ];
      extras.forEach(f => this.signUpForm.get(f)!.clearValidators());

      if (value === 'Patient') {
        this.signUpForm.get('dob')!.setValidators([Validators.required]);
        this.signUpForm.get('address')!.setValidators([Validators.required]);
      }
      if (value === 'Pharmacy') {
        this.signUpForm.get('pharmacyName')!.setValidators([Validators.required]);
        this.signUpForm.get('pharmacyPhone')!.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]);
        this.signUpForm.get('pharmacyAddress')!.setValidators([Validators.required]);
        this.signUpForm.get('lat')!.setValidators([Validators.required]);
        this.signUpForm.get('lng')!.setValidators([Validators.required]);
      }

      Object.keys(this.signUpForm.controls).forEach(f =>
        this.signUpForm.get(f)!.updateValueAndValidity()
      );
    });
  }

  ngOnInit(): void {
    // Nada aquí; el mapa se inicializa tras llamar a detectLocation()
  }

  /** Consulta Nominatim para obtener dirección legible */
  private async fetchAddress(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'healthcare-app' } });
      const data = await res.json();
      return data.display_name || '';
    } catch {
      return '';
    }
  }

  detectLocation(): void {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) {
      return alert('Tu navegador no soporta geolocalización');
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await this.fetchAddress(lat, lng);
        this.signUpForm.patchValue({ pharmacyAddress: address, lat, lng });
        setTimeout(() => this.initializeMap(lat, lng), 0);
      },
      () => alert('No pudimos obtener tu ubicación')
    );
  }

  private initializeMap(lat: number, lng: number): void {
    if (!isPlatformBrowser(this.platformId) || this.map) return;
    const container = document.getElementById('signupMap');
    if (!container) {
      return setTimeout(() => this.initializeMap(lat, lng), 100) as unknown as void;
    }
    import('leaflet').then(L => {
      this.map = L.map('signupMap').setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(this.map);
      L.marker([lat, lng]).addTo(this.map).bindPopup('📍 Aquí estás').openPopup();
      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const d = this.signUpForm.value;
    const payload: any = {
      username: d.name.trim(),
      email:    d.email.trim().toLowerCase(),
      password: d.password,
      role:     d.userType,
      phone:    d.phone
    };

    if (d.userType === 'Patient') {
      payload.dob            = d.dob;
      payload.address        = d.address.trim();
    }

    if (d.userType === 'Pharmacy') {
      // Aplanamos aquí en lugar de usar payload.pharmacy = {…}
      payload.pharmacyName    = d.pharmacyName.trim();
      payload.pharmacyPhone   = d.pharmacyPhone;
      payload.pharmacyAddress = d.pharmacyAddress.trim();
      payload.lat             = d.lat;
      payload.lng             = d.lng;
    }

    this.authService.register(payload).subscribe({
      next: () => {
        alert('Registro exitoso!');
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        const msg = err.error?.message;
        alert(Array.isArray(msg) ? msg.join('\n') : msg || 'Verifica tus datos');
      }
    });
  }
}
