import { IsEnum, IsInt, IsDateString } from 'class-validator';
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export class CreateDoctorScheduleDto {
  @IsInt()
  doctorId: number;

  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
