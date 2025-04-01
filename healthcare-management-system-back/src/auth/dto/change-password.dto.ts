import { IsString, IsNotEmpty, MinLength,Matches, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña actual debe tener al menos 8 caracteres' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {message:"contraseña no debe ser menor a 8 caracteres"})
  @MaxLength(30 ,{message:"contraseña no debe ser mayor a 30 caracteres"})
   @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    { message: 'La nueva contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (!@#$%^&*)' }
  )
  newPassword: string;

}
