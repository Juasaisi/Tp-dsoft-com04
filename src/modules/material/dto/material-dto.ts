import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class MaterialDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    idmaterial!:number;

    @IsString()
    @IsNotEmpty()
    tipoMaterial!:string;


    @IsString()
    @IsNotEmpty()
    descripcion!:string;

    @IsBoolean()
    @IsNotEmpty()
    stock!:boolean;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    cantidad!:number;

   @IsOptional()
   @IsBoolean()
    delete?:boolean;


}