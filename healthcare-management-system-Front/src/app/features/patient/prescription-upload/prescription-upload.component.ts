import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { PharmacyService, Pharmacy } from '../../../core/services/pharmacy.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-prescription-upload',
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.css'],
})
export class PrescriptionUploadComponent implements OnInit, OnDestroy {
  @Input()  selectedPharmacy!: Pharmacy | null;
  @Output() pharmacyChosen    = new EventEmitter<Pharmacy>();

  nearbyPharmacies: Pharmacy[] = [];
  selectedFile: File | null    = null;
  patientId!: number;  // Ya no asignamos valor fijo
  isUploading = false;
  uploadSuccess = false;
  uploadError: string | null = null;

  private subs = new Subscription();

  constructor(
    private readonly prescriptionService: PrescriptionService,
    private readonly pharmacyService: PharmacyService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadNearbyPharmacies();

    // Obtener el usuario logueado y asignar patientId
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Patient') {
      console.log("user.id: ",user.id)
      this.patientId = user.id;

    } else {
      // Opcional: manejar caso si no es paciente o no hay usuario
      console.error('Usuario no autenticado o no es paciente.');
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadNearbyPharmacies(): void {
    const fetchList = (lat: number, lng: number) => {
      this.subs.add(
        this.pharmacyService.getNearby(lat, lng).subscribe(list => {
          this.nearbyPharmacies = list.slice(0, 4);
        })
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchList(pos.coords.latitude, pos.coords.longitude),
        ()  => fetchList(4.9714, -75.5636)
      );
    } else {
      fetchList(4.9714, -75.5636);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadError = null;
      this.uploadSuccess = false;
    }
  }

  onPharmacySelected(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.selectedPharmacy = this.nearbyPharmacies.find(p => p.id === id) ?? null;
    this.uploadError = null;
    this.uploadSuccess = false;
    if (this.selectedPharmacy) {
      this.pharmacyChosen.emit(this.selectedPharmacy);
    }
  }

  canUpload(): boolean {
    return !!(this.selectedFile && this.selectedPharmacy && !this.isUploading);
  }

  upload(): void {
    if (!this.canUpload()) {
      this.uploadError = 'Por favor selecciona un archivo y una farmacia.';
      return;
    }

    if (!this.patientId) {
      this.uploadError = 'No se pudo determinar el paciente autenticado.';
      return;
    }

    this.isUploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;

    this.prescriptionService
      .uploadPrescription(
        this.patientId,
        this.selectedPharmacy!.id,
        this.selectedFile!
      )
      .subscribe({
        next: () => {
          this.uploadSuccess = true;
          this.isUploading = false;
          this.selectedFile = null;
          const inp = document.getElementById('fileInput') as HTMLInputElement;
          if (inp) inp.value = '';
        },
        error: err => {
          this.uploadError = 'Error al subir el archivo: ' + (err.message || 'desconocido');
          this.isUploading = false;
        },
      });
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadError = null;
    this.uploadSuccess = false;
    const inp = document.getElementById('fileInput') as HTMLInputElement;
    if (inp) inp.value = '';
  }
}
