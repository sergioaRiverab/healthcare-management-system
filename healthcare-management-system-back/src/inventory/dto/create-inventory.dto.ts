import { IsInt, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  pharmacyId: number;

  @IsInt()
  medicationId: number;

  @IsInt()
  @Min(0)
  quantity: number;
}
