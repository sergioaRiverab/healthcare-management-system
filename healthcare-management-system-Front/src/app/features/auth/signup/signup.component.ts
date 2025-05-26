import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { RouterLink, Router } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { LocationSelectorComponent } from "../../../shared/components/location-selector/location-selector.component"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LocationSelectorComponent],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    this.signUpForm = this.fb.group({
      userType: ["Patient", Validators.required],
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]],
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
    })

    // Ajuste dinámico de validadores según tipo
    this.signUpForm.get("userType")!.valueChanges.subscribe((value) => {
        if (this.signUpForm.get("userType")?.value !== value) {
                this.updateValidatorsAndClearFields(value)
        }

    })

    // Inicializar validadores para el valor por defecto
    this.updateValidatorsAndClearFields("Patient")
  }

  ngOnInit(): void {
    // No initialization needed here anymore
  }

  private updateValidatorsAndClearFields(userType: string): void {
    // Limpiar todos los validadores de campos específicos
    const patientFields = ["dob"]
    const pharmacyFields = ["pharmacyAddress", "lat", "lng"]

    // Limpiar validadores de todos los campos específicos
    patientFields.concat(pharmacyFields).forEach((field) => {
      this.signUpForm.get(field)?.clearValidators()
      this.signUpForm.get(field)?.setValue("") // Limpiar valores
    })

    // Limpiar campos específicos de coordenadas
    if (userType !== "Pharmacy") {
      this.signUpForm.get("lat")?.setValue(null)
      this.signUpForm.get("lng")?.setValue(null)
    }

    // Aplicar validadores según el tipo de usuario
    if (userType === "Patient") {
      this.signUpForm.get("dob")!.setValidators([Validators.required])
    } else if (userType === "Pharmacy") {
      this.signUpForm.get("pharmacyAddress")!.setValidators([Validators.required])
      this.signUpForm.get("lat")!.setValidators([Validators.required])
      this.signUpForm.get("lng")!.setValidators([Validators.required])
    }

    // Actualizar validación de todos los campos
    Object.keys(this.signUpForm.controls).forEach((field) => {
      this.signUpForm.get(field)!.updateValueAndValidity()
    })
  }

  handleLocationSelected(locationData: { lat: number; lng: number; address: string }): void {
    this.signUpForm.patchValue({
      pharmacyAddress: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
    })
  }

  onSubmit(): void {
    console.log("Form status:", this.signUpForm.status)
    console.log("Form errors:", this.getFormErrors())
    console.log("Form values:", this.signUpForm.value)

    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched()
      console.log("Form is invalid, marking all as touched")
      return
    }

    const d = this.signUpForm.value
    const payload: any = {
      username: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      password: d.password,
      role: d.userType,
      phone: d.phone,
    }

    if (d.userType === "Patient") {
      payload.dob = d.dob
    }

    if (d.userType === "Pharmacy") {
      payload.address = d.pharmacyAddress.trim()
      payload.lat = d.lat
      payload.lng = d.lng
    }

    console.log("Payload to send:", payload)

    this.authService.register(payload).subscribe({
      next: () => {
        alert("Registro exitoso!")
        this.router.navigate(["/auth/login"])
      },
      error: (err) => {
        console.error("Registration error:", err)
        const msg = err.error?.message
        alert(Array.isArray(msg) ? msg.join("\n") : msg || "Verifica tus datos")
      },
    })
  }

  // Método auxiliar para debug - mostrar errores del formulario
  private getFormErrors(): any {
    const errors: any = {}
    Object.keys(this.signUpForm.controls).forEach((key) => {
      const control = this.signUpForm.get(key)
      if (control && control.errors) {
        errors[key] = control.errors
      }
    })
    return errors
  }
}
