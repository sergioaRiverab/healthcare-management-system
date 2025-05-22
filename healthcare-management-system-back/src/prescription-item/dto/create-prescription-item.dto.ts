import { IsInt, Min, IsEnum } from 'class-validator';
import { PrescriptionItemStatus } from '@prisma/client';
export class CreatePrescriptionItemDto {
  @IsInt()
  prescriptionId: number;

  @IsInt()
  medicationId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(PrescriptionItemStatus)
  status?: PrescriptionItemStatus;
}