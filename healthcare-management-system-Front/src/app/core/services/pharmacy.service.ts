import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pharmacy {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: number;
}

@Injectable({ providedIn: 'root' })
export class PharmacyService {
  constructor(private http: HttpClient) {}

  getNearby(lat: number, lng: number): Observable<Pharmacy[]> {
    return this.http.get<Pharmacy[]>(
      `/api/pharmacies/nearby?lat=${lat}&lng=${lng}`
    );
  }
}