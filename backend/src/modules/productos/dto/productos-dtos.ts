import { IsNotEmpty, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class ProductosDto {


   
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
    @Min(0)
    stock!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio!:number;

    @IsOptional()
    @IsBoolean()
    eliminado?:boolean;
  
}
