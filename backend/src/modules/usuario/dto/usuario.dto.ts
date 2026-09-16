import { IsBoolean, IsNotEmpty, IsOptional, IsIn, IsString, IsEmail, IsNumber, IsPositive } from "class-validator";


export class UsuarioDto {
    //id nombre email contraseña rol

    @IsPositive()
    @IsNumber()
    idUsuario!: number;


    @IsString()
    @IsNotEmpty()
    nombre!: string;


    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsEmail()
    @IsNotEmpty()
    contraseña!: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['ADMIN', 'VENDEDOR'])
    rol!: string;

    @IsBoolean()
    @IsOptional()
    eliminado?: boolean;
}
