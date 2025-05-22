// src/app/prescription-upload/prescription-upload.component.ts
import { Component } from '@angular/core';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-prescription-upload',
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.css'],
})

export class PrescriptionUploadComponent {
  selectedFile: File | null = null;
  patientId = 1;
  patientLat = 4.710;
  patientLng = -74.072;

  constructor(private prescriptionService: PrescriptionService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  upload(): void {
    if (!this.selectedFile) return;
    this.prescriptionService
      .uploadPrescription(
        this.patientId,
        this.patientLat,
        this.patientLng,
        this.selectedFile
      )
      .subscribe({
        next: res => {
          console.log('Upload successful:', res);
          alert('Upload successful');
        },
        error: err => {
          console.error('Upload failed:', err);
          alert('Upload failed: ' + err.message);
        }
      });
  }
}