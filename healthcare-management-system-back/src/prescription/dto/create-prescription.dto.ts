import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  pharmacyId: number;

  file: any;

}