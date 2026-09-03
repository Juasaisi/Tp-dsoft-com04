import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class Sale_detailsDto {


    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    idsale_d!:number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    cantidad!:number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    preciounitario!:number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    subtotal!:number;
}