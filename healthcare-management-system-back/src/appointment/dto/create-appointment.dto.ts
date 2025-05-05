import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsInt()
  patientId: number;

  @IsInt()
  doctorId: number;
}
