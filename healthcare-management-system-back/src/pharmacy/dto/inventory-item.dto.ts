import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class InventoryItemDto {
  @IsNumber()
  id: number;

  @IsString()
  medicationName: string;

  @IsNumber()
  stockLevel: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  minimumStockLevel?: number;

  @IsString()
  @IsOptional()
  lastRestocked?: Date;
} 