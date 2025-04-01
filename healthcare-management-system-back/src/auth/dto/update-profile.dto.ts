import { IsOptional, IsString, IsEmail, IsDateString ,Matches,MaxLength} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Para Patient
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD' 
  })
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'El historial médico no puede exceder 1000 caracteres' })
  medicalHistory?: string;

  // Para Doctor
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'La especialidad no puede exceder 50 caracteres' })
  specialty?: string;

  @IsOptional()
  @IsString()
  schedule?: string;
}
