import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, IsBoolean, IsOptional } from "class-validator";

export class ClienteDto {
 @IsNumber()
 @IsPositive()
 idCliente!: number;

 @IsString()
 @IsNotEmpty()
 name!: string;

 @IsString()
 @IsNotEmpty()
 surname!: string;

 @IsString()
 @IsNotEmpty()
 phone!: string;

 @IsEmail()
 @IsNotEmpty()
 email!: string;

 @IsBoolean()
 @IsOptional()
 delete!: boolean;



 }


 






