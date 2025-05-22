
export enum NotificationType{
    PRESCRIPTION_UPDATED,
    APPOINTMENT_REMINDER,
    STATUS_CHANGED
}

export class NotificationEntity {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}