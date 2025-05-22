
export enum AppointmentStatus {
    PENDING,
  CONFIRMED,
  CANCELLED
}
export class AppointmentEntity {
  id: number;
  patientId: number;
  pharmacyId: number;
  date: Date;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}