import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class PagoDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    idPago!:number;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    fecha!: Date;


    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    importe!:number;

   @IsString()
   @IsNotEmpty()
   medioPago!: string;

   @IsBoolean()
   @IsOptional()
   eliminado?: boolean;


}