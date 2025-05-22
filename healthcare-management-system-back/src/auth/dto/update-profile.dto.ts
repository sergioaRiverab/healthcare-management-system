import {
  IsOptional, IsString, IsEmail, IsDateString,
  Matches, MaxLength, IsNumber
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString()
  username?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  phone?: string;

  // Patient
  @IsOptional() @IsDateString() @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dob?: string;

  @IsOptional() @IsString() @MaxLength(200)
  address?: string;

  @IsOptional() @IsString() @MaxLength(1000)
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
