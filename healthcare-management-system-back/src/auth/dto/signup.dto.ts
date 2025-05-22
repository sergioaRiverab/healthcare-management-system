import {
  IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum,
  IsDateString, Matches, MinLength, MaxLength, IsNumber
} from 'class-validator';

import { UserRole }from '@prisma/client';


export class SignupDto {
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsEmail() @MaxLength(30)
  email: string;

  @IsString() @IsNotEmpty() @MinLength(8) @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional() @Matches(/^[0-9+() -]+$/) @MaxLength(20)
  phone?: string;

  // Patient
  @IsOptional() @IsDateString() @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dob?: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  medicalHistory?: string;

  // Pharmacy
  @IsOptional() @IsString()
  pharmacyName?: string;

  @IsOptional() @Matches(/^[0-9]{10}$/)
  pharmacyPhone?: string;

  @IsOptional() @IsString()
  pharmacyAddress?: string;

  @IsOptional() @IsNumber()
  lat?: number;

  @IsOptional() @IsNumber()
  lng?: number;
}
