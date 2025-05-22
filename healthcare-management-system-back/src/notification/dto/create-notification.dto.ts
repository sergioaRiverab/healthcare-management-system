import { IsInt, IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}