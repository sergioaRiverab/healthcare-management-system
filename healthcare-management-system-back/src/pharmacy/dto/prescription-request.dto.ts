import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export enum PrescriptionRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export class PrescriptionRequestDto {
  @IsNumber()
  id: number;

  @IsNumber()
  patientId: number;

  @IsNumber()
  prescriptionId: number;

  @IsEnum(PrescriptionRequestStatus)
  status: PrescriptionRequestStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  createdAt: Date;

  @IsString()
  @IsOptional()
  updatedAt?: Date;
} 