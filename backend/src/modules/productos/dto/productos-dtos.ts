import { IsNotEmpty, IsBoolean, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class ProductosDto {


    @IsOptional()
    @IsNumber()
    @IsPositive()
    id!:number;

    @IsString()
    @IsNotEmpty()
    nombre!:string;

    @IsString()
    @IsNotEmpty()
    descripcion!:string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    stock!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio!:number;

    @IsOptional()
    @IsBoolean()
    eliminado?:boolean;
  
}
