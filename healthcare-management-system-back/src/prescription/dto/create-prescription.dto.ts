import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @IsInt()
  patientId: number;

  @IsNumber()
  patientLat: number;

  @IsNumber()
  patientLng: number;

  file: any;

}