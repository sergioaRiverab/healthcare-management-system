import { IsInt, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  pharmacyId: number;

  @IsDateString()
  date: string;


  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}