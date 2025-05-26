// src/app/core/services/medication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Medication {
  id:   number;
  name: string;
  // añade aquí más campos si tu API los devuelve
}

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private baseUrl = `${environment.apiUrl}/medications`;

  constructor(private readonly http: HttpClient) {}

  /** Trae todas las medicaciones disponibles */
  getAll(): Observable<Medication[]> {
    return this.http.get<Medication[]>(this.baseUrl);
  }

  /** Trae una medicación concreta por id */
  getById(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${this.baseUrl}/${id}`);
  }
}
