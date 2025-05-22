export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  day: DayOfWeek;
  startTime: string; 
  endTime: string;  
}
