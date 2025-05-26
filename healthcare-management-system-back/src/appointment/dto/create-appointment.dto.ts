// src/appointments/dto/create-appointment.dto.ts
import { IsInt, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  pharmacyId: number;

  @IsInt()
  @IsOptional()
  prescriptionId?: number;     

  @IsDateString()
  date: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
