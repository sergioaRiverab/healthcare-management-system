import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DoctorSchedule } from '../models/DoctorSchedule.model';

@Injectable({ providedIn: 'root' })
export class DoctorScheduleService {
  private apiUrl = `${environment.apiUrl}/doctor-schedules`;
  private schedulesSubject = new BehaviorSubject<DoctorSchedule[] | null>(null);
  schedules$ = this.schedulesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.getSchedules().subscribe({
      next: schedules => this.schedulesSubject.next(schedules),
      error:      () => this.schedulesSubject.next(null),
    });
  }

  getSchedules(): Observable<DoctorSchedule[]> {
    return this.http.get<DoctorSchedule[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        catchError(err => throwError(() => new Error('No se pudieron cargar las programaciones')))
      );
  }

  getScheduleById(id: number): Observable<DoctorSchedule> {
    return this.http.get<DoctorSchedule>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(
        catchError(() => throwError(() => new Error('No se encontró la programación')))
      );
  }

  createSchedule(data: Partial<DoctorSchedule>): Observable<DoctorSchedule> {
    return this.http.post<DoctorSchedule>(this.apiUrl, data, { withCredentials: true })
      .pipe(
        tap(() => this.loadSchedules()),
        catchError(() => throwError(() => new Error('No se pudo crear la programación')))
      );
  }

  updateSchedule(id: number, data: Partial<DoctorSchedule>): Observable<DoctorSchedule> {
    return this.http.patch<DoctorSchedule>(`${this.apiUrl}/${id}`, data, { withCredentials: true })
      .pipe(
        tap(() => this.loadSchedules()),
        catchError(() => throwError(() => new Error('No se pudo actualizar la programación')))
      );
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(
        tap(() => this.loadSchedules()),
        catchError(() => throwError(() => new Error('No se pudo eliminar la programación')))
      );
  }
}
