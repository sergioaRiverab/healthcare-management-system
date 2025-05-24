import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/home/home.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';	
import { PatientDashboardComponent } from './features/patient/patient-dashboard/patient-dashboard.component';
import { PharmacyDashboardComponent } from './features/pharmacy-dashboard.component';
import { roleGuard } from './core/guards/role.guard';
import { PharmacyRequestsComponent } from './features/pharmacy/pharmacy-requests/pharmacy-requests.component';
import { PharmacyRequestDetailComponent } from './features/pharmacy/pharmacy-request-detail/pharmacy-request-detail.component';
import { ManagePharmacyRequestComponent } from './features/pharmacy/manage-pharmacy-request/manage-pharmacy-request.component';
import { PharmacyInventoryComponent } from './features/pharmacy/pharmacy-inventory/pharmacy-inventory.component';
import { AddPharmacyInventoryComponent } from './features/pharmacy/add-pharmacy-inventory/add-pharmacy-inventory.component';
import { EditPharmacyInventoryComponent } from './features/pharmacy/edit-pharmacy-inventory/edit-pharmacy-inventory.component';
import { PharmacyAppointmentsComponent } from './features/pharmacy/pharmacy-appointments/pharmacy-appointments.component';
import { PharmacyAppointmentDetailComponent } from './features/pharmacy/pharmacy-appointment-detail/pharmacy-appointment-detail.component';
import { ConfirmPharmacyAppointmentComponent } from './features/pharmacy/confirm-pharmacy-appointment/confirm-pharmacy-appointment.component';
import { PharmacyNotificationsComponent } from './features/pharmacy/pharmacy-notifications/pharmacy-notifications.component';
import { PharmacyProfileComponent } from './features/pharmacy/pharmacy-profile/pharmacy-profile.component';

export const routes: Routes = [
    {path: '',component: HomeComponent},
    {path: 'auth/signup',component: SignupComponent},
    {path: 'auth/login', component: LoginComponent}, 
    {
        path: 'patient/dashboard', 
        component: PatientDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 'Patient' }
    },
    {
        path: 'pharmacy',
        children: [
            {
                path: 'dashboard',
                component: PharmacyDashboardComponent,
                canActivate: [roleGuard],
                data: { role: 'Pharmacy' }
            },
            {
                path: 'requests',
                component: PharmacyRequestsComponent
            },
            {
                path: 'requests/:id',
                component: PharmacyRequestDetailComponent
            },
            {
                path: 'requests/:id/manage',
                component: ManagePharmacyRequestComponent
            },
            {
                path: 'inventory',
                component: PharmacyInventoryComponent
            },
            {
                path: 'inventory/add',
                component: AddPharmacyInventoryComponent
            },
            {
                path: 'inventory/:medicineId/edit',
                component: EditPharmacyInventoryComponent
            },
            {
                path: 'appointments',
                component: PharmacyAppointmentsComponent
            },
            {
                path: 'appointments/:id',
                component: PharmacyAppointmentDetailComponent
            },
            {
                path: 'appointments/confirm/:id',
                component: ConfirmPharmacyAppointmentComponent
            },
            {
                path: 'notifications',
                component: PharmacyNotificationsComponent
            },
            {
                path: 'profile',
                component: PharmacyProfileComponent
            },
        ]
    },
    { path: '**', redirectTo: '' },
];
