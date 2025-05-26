import {
  IsInt,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
export class CreatePrescriptionDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  pharmacyId: number;

  file: any;



}