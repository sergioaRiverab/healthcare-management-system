import { Component, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  type FormGroup,
  Validators,
} from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { LocationSelectorComponent } from "../../../shared/components/location-selector/location-selector.component";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LocationSelectorComponent,
  ],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    // 1) Creamos el formulario con todos los campos, pero sin validadores específicos
    this.signUpForm = this.fb.group({
      userType: ["Patient", Validators.required],
      name: ["", [Validators.required, Validators.maxLength(80)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      // Patient fields
      dob: [""],
      // Pharmacy fields
      pharmacyAddress: [""],
      lat: [null],
      lng: [null],
      // Credentials
      password: [
        "",
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/),
        ],
      ],
      terms: [false, Validators.requiredTrue],
    });

    // 2) Suscripción fija para reconfigurar validadores SIEMPRE que cambie userType
    this.signUpForm.get("userType")!
      .valueChanges
      .subscribe((newType: string) => {
        this.updateValidatorsAndClearFields(newType);
      });

    // 3) Inicializamos validadores para el tipo por defecto
    this.updateValidatorsAndClearFields("Patient");
  }

  ngOnInit(): void {
    // No necesita nada adicional en ngOnInit
  }

  /**
   * Ajusta validadores según si es Patient o Pharmacy,
   * y limpia los valores de los campos no aplicables.
   */
  private updateValidatorsAndClearFields(userType: string): void {
    const patientFields = ["dob"];
    const pharmacyFields = ["pharmacyAddress", "lat", "lng"];

    // 1) Limpiar todos los validadores y valores de campos específicos
    [...patientFields, ...pharmacyFields].forEach((field) => {
      const ctrl = this.signUpForm.get(field);
      if (!ctrl) return;
      ctrl.clearValidators();
      // Para lat/lng ponemos null, para los demás string vacío
      const isCoord = field === "lat" || field === "lng";
      ctrl.setValue(isCoord ? null : "");
    });

    // 2) Aplicar validadores según userType
    if (userType === "Patient") {
      this.signUpForm.get("dob")!.setValidators([Validators.required]);
    } else if (userType === "Pharmacy") {
      this.signUpForm
        .get("pharmacyAddress")!
        .setValidators([Validators.required]);
      this.signUpForm.get("lat")!.setValidators([Validators.required]);
      this.signUpForm.get("lng")!.setValidators([Validators.required]);
    }

    // 3) Forzar actualización de estado de validación en todos los controles
    Object.values(this.signUpForm.controls).forEach((c) => c.updateValueAndValidity());
  }

  handleLocationSelected(locationData: {
    lat: number;
    lng: number;
    address: string;
  }): void {
    this.signUpForm.patchValue({
      pharmacyAddress: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
    });
  }

  onSubmit(): void {
    console.log("Form status:", this.signUpForm.status);
    console.log("Form errors:", this.getFormErrors());
    console.log("Form values:", this.signUpForm.value);

    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      console.log("Form is invalid, marking all as touched");
      return;
    }

    const d = this.signUpForm.value;
    const payload: any = {
      username: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      password: d.password,
      role: d.userType,
      phone: d.phone,
    };

    if (d.userType === "Patient") {
      payload.dob = d.dob;
    } else {
      payload.address = d.pharmacyAddress.trim();
      payload.lat = d.lat;
      payload.lng = d.lng;
    }

    console.log("Payload to send:", payload);

    this.authService.register(payload).subscribe({
      next: () => {
        alert("Registro exitoso!");
        this.router.navigate(["/"]);
      },
      error: (err) => {
        console.error("Registration error:", err);
        const msg = err.error?.message;
        alert(Array.isArray(msg) ? msg.join("\n") : msg || "Verifica tus datos");
      },
    });
  }

  /** Retorna un objeto con todos los errores actuales del formulario */
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.signUpForm.controls).forEach((key) => {
      const control = this.signUpForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
