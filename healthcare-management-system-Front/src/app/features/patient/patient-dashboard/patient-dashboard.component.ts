// patient-dashboard.component.ts
import { Component } from '@angular/core';
import { Pharmacy } from '../../../core/services/pharmacy.service';
import { PrescriptionUploadComponent } from '../prescription-upload/prescription-upload.component';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AppointmentService } from '../../../core/services/appoinments.service';
import { AuthService } from '../../../core/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { GenericAppointmentTableComponent } from '../../../shared/components/generic-appointment-table/generic-appointment-table.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [PrescriptionUploadComponent, AppointmentsComponent,NotificationsComponent,GenericAppointmentTableComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
})
export class PatientDashboardComponent {
  selectedPharmacy: Pharmacy | null = null;
constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {}

  // Función para obtener las citas del paciente
  fetchAppointmentsFn = () => {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.id) {
          return this.appointmentService.getAppointmentsByPatientUser(user.id);
        } else {
          // Return an empty observable if user is null or undefined
          return [];
        }
      })
    );
  };

  // Función para mapear las citas
  mapAppointmentsFn = (appointment: any) => ({
    id: appointment.id,
    date: new Date(appointment.date),
    status: appointment.status,
  });

  // Acciones para las citas (como ver detalles y cancelar)
  appointmentActions = [
    {
      label: 'View Details',
      callback: (appointment: any) => this.viewAppointmentDetails(appointment),
      class: 'px-3 py-1 bg-blue-600 text-white rounded',
    },

  ];

  // Ver detalles de una cita
  viewAppointmentDetails(appointment: any) {
    console.log('Viewing details for appointment:', appointment);
  }

  // Cancelar una cita
  cancelAppointment(appointment: any) {
    this.appointmentService.cancelAppointment(appointment.id).subscribe({
      next: () => {
        alert('Cita cancelada correctamente');
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
        alert('Error al cancelar la cita');
      },
    });
  }
}