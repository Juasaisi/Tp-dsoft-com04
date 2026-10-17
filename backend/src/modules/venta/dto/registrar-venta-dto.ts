import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

// Cada renglón de la venta: qué producto y cuántas unidades.
export class ItemVentaDto {
  @IsInt()
  @IsPositive()
  idProducto!: number;

  @IsInt()
  @IsPositive()
  cantidad!: number;
}

// Lo que se manda para registrar una venta completa.
// El total y los precios NO se mandan: los calcula el servidor.
export class RegistrarVentaDto {
  @IsInt()
  @IsPositive()
  idCliente!: number;

  // Opcional: si no se manda, se usa la fecha de hoy.
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items!: ItemVentaDto[];
}