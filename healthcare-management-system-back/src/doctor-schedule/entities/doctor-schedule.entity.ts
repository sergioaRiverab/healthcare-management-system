export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export class DoctorScheduleEntity {
  id: number;
  doctorId: number;
  day: DayOfWeek;
  startTime: Date;
  endTime: Date;
}
