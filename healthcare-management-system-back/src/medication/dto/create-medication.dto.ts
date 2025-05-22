import { IsString, IsOptional } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}