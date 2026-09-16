import { IsNotEmpty, IsNumber, IsPositive, IsString, IsBoolean, IsOptional } from "class-validator";

export class CategoriaDto {
 @IsNumber()
 @IsPositive()
 idCategoria!: number;

 @IsString()
 @IsNotEmpty()
 name!: string;


 @IsBoolean()
 @IsOptional()
 activo!: boolean;



 }


 

