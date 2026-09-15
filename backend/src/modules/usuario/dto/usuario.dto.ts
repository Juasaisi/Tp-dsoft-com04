import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsEmail } from "class-validator";


export class UsuarioDto {
    //id nombre email contraseña rol




    @IsNumber()
    @IsPositive()
    idUsuario!:number;


    @IsString()
    @IsNotEmpty()
    name!: string;


    @IsEmail()
    @IsNotEmpty()
    email!: string;


    //contraseña


    @IsString()
    @IsNotEmpty()
    rol!: string;
}
