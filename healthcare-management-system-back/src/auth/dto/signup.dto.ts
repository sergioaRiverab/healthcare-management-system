import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsDateString,  Matches, 
  MinLength, MaxLength } from 'class-validator';

export enum UserRole {
  Doctor = 'Doctor',
  Patient = 'Patient',
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'El nombre de usuario no puede exceder 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_)' 
  })
  username: string;

  @IsEmail()
  @MaxLength(30, { message: 'El email no puede exceder 30 caracteres' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {message:"contraseña no debe ser menor a 8 caracteres"})
  @MaxLength(30 ,{message:"contraseña no debe ser mayor a 30 caracteres"})
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    { message: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (!@#$%^&*)' }
  )
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+() -]+$/, { 
    message: 'El telefono solo puede contener números, +, (), guiones y espacios' 
  })
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  phone?: string;

  // Campos específicos para Patient
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD' 
  })
  dob?: string;
  
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  // Campos específicos para Doctor
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  schedule?: string;
}
