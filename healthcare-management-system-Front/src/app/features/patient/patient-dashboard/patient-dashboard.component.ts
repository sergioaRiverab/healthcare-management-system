import { Component } from '@angular/core';
import { PrescriptionUploadComponent } from '../prescription-upload/prescription-upload.component';
import { AppointmentsComponent } from '../appointments/appointments.component';
@Component({
  selector: 'app-patient-dashboard',
  imports: [PrescriptionUploadComponent,AppointmentsComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {

}
