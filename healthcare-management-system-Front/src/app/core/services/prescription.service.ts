// src/core/services/prescription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class PrescriptionService {
    
  private baseUrl = environment.apiUrl + '/prescriptions';

  constructor(private http: HttpClient) {}

  uploadPrescription(
    patientId: number,
    pharmacyId: number,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId.toString());
    formData.append('pharmacyId', pharmacyId.toString());
    return this.http.post(this.baseUrl, formData);
  }

  //get prescriptions
  getPrescriptions(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${patientId}`);
  }

  findByPharmacyUser(userId:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-user/${userId}`);
  }


}
