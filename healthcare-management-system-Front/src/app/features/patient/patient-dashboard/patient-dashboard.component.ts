// patient-dashboard.component.ts
import { Component } from '@angular/core';
import { Pharmacy } from '../../../core/services/pharmacy.service';
import { PrescriptionUploadComponent } from '../prescription-upload/prescription-upload.component';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [PrescriptionUploadComponent, AppointmentsComponent,NotificationsComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
})
export class PatientDashboardComponent {
  selectedPharmacy: Pharmacy | null = null;
}
