import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class Sale_detailsDto {


    @IsNumber()
    @IsPositive()
    @IsOptional()
    idsale_d?:number;

    @IsNumber()
    @IsPositive()
    idVenta!: number;

    @IsNumber()
    @IsPositive()
    idProducto!: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    cantidad!:number;

    //precio unitario y subtotal los calcula el sistema
}