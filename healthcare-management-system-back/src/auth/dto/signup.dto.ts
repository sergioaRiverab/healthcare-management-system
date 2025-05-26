import {
  IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum,
  IsDateString, Matches, MinLength, MaxLength, IsNumber,ValidatorConstraint,
  ValidatorConstraintInterface, ValidationArguments,Validate,
} from 'class-validator';

import { UserRole }from '@prisma/client';

@ValidatorConstraint({ name: 'AgeBetween14And100', async: false })
class AgeBetween14And100Constraint implements ValidatorConstraintInterface {
  validate(dob: string, _args: ValidationArguments) {
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return false;

    const now = new Date();
    const ageMs = now.getTime() - birth.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);

    return ageYears >= 14 && ageYears <= 100 && birth < now;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'dob must be a past date corresponding to an age between 14 and 100 years';
  }
}


export class SignupDto {
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(80)
@Matches(/^[A-Za-z\s]+$/, {
  message: "username sólo puede contener letras y espacios"
})  username: string;

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
  @Validate(AgeBetween14And100Constraint)
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
