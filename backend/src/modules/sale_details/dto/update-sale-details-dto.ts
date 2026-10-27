import { IsInt, IsPositive } from 'class-validator';

export class UpdateSaleDetailsDto {
  @IsInt()
  @IsPositive()
  cantidad!: number;
}