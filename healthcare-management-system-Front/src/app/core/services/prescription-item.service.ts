import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PrescriptionItem {
  id: number;
  prescriptionId: number;
  medicationId: number;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BACKORDERED';
  createdAt?: string;
  updatedAt?: string;
}
export interface CreatePrescriptionItem {
  prescriptionId: number;
  medicationId: number;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BACKORDERED';
}


@Injectable({ providedIn: 'root' })
export class PrescriptionItemService {
  private baseUrl = `${environment.apiUrl}/prescription-items`;

  constructor(private readonly http: HttpClient) {}

  /** Crea uno o varios ítems de prescripción */
  create(
    items: Array<{
      prescriptionId: number;
      medicationId: number;
      quantity: number;
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BACKORDERED';
    }>
  ): Observable<PrescriptionItem[]> {
    return this.http.post<PrescriptionItem[]>(this.baseUrl, { items });
  }

// Angular prescription-item.service.ts
bulkCreate(items: CreatePrescriptionItem[]): Observable<PrescriptionItem[]> {
  return this.http.post<PrescriptionItem[]>(`${this.baseUrl}/bulk`, { items });
}



  /** Obtiene los ítems de una prescripción */
  getByPrescription(prescriptionId: number): Observable<PrescriptionItem[]> {
    return this.http.get<PrescriptionItem[]>(
      `${this.baseUrl}/prescription/${prescriptionId}`
    );
  }

  /** Actualiza un ítem existente */
  update(
    id: number,
    changes: Partial<Pick<PrescriptionItem, 'quantity' | 'status'>>
  ): Observable<PrescriptionItem> {
    return this.http.patch<PrescriptionItem>(`${this.baseUrl}/${id}`, changes);
  }

  /** Elimina un ítem */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
