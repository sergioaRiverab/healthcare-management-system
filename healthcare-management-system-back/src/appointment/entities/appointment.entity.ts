export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}
export class AppointmentEntity {
  id: number;
  date: Date;
  notes: string | null;
  status: AppointmentStatus;
  patientId: number;
  doctorId: number;
  createdAt: Date;
  updatedAt: Date;
}
