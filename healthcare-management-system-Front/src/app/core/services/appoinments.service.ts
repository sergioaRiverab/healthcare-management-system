import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AppointmentService {
    
  private baseUrl = environment.apiUrl + '/appointments';

  constructor(private http: HttpClient) {}



  //post appointment
    createAppointment(
        patientId: number,
        pharmacyId: number,
        date: Date,
        prescriptionId?: number
    ): Observable<any> {
        const body = {
        patientId,
        pharmacyId,
        date,
        prescriptionId
        };
        return this.http.post(this.baseUrl, body);
    }


    //get appointments by pharmacy user
    getAppointmentsByPharmacyUser(userId: number): Observable<any[]> {
        console.log(`Fetching appointments for pharmacy user with ID: ${userId}`);
        return this.http.get<any[]>(`${this.baseUrl}/pharmacy/${userId}`);
    }

    //get appointments by patient user
    getAppointmentsByPatientUser(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/patient/${userId}`);
    }


    //cancel Appointment
    cancelAppointment(appointmentId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${appointmentId}`);
    }



}
