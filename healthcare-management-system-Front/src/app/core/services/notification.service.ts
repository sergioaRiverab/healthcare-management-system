// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface AppNotification {
  id:        number;
  type:      string;
  message:   string;
  read:      boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private baseUrl = environment.apiUrl + '/notifications';
  

  constructor(private http: HttpClient) {}

  /** Obtiene todas las notificaciones del usuario actual */

  getNotificationsByUserId(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.baseUrl}/user/${userId}`);
  }
}
