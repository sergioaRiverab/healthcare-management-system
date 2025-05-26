// src/app/features/notifications/notifications.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { interval, Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap, catchError, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private POLLING_INTERVAL = 15000; // 15 segundos

  constructor(
    private notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      this.error = 'Usuario no autenticado.';
      this.loading = false;
      return;
    }

    // Polling cada POLLING_INTERVAL para recargar las notificaciones
    interval(this.POLLING_INTERVAL).pipe(
      // Cuando arranca, dispara inmediatamente una vez
      startWith(0),
      takeUntil(this.destroy$),
      tap(() => {
        this.loading = true;
        this.error = null;
      }),
      switchMap(() =>
        this.notificationService.getNotificationsByUserId(user.id).pipe(
          catchError(err => {
            this.error = 'No se pudieron cargar las notificaciones.';
            // devolvemos array vacío para mantener flujo
            return of<AppNotification[]>([]);
          })
        )
      )
    ).subscribe({
      next: (notes: AppNotification[]) => {
        this.notifications = notes;
        this.loading = false;
      },
      error: () => {
        // no debería llegar aquí porque catchError lo atrapa
        this.error = 'Error inesperado.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Cortamos el polling al destruir
    this.destroy$.next();
    this.destroy$.complete();
  }
}
