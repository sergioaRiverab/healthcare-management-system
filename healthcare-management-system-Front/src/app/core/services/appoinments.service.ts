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
        date: Date
    ): Observable<any> {
        const body = {
        patientId,
        pharmacyId,
        date
        };
        return this.http.post(this.baseUrl, body);
    }




}
