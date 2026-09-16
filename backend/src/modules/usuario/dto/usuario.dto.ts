import { IsBoolean, IsNotEmpty, IsOptional, IsIn, IsString, IsEmail } from "class-validator";


export class UsuarioDto {
    //id nombre email contraseña rol


    @IsString()
    @IsNotEmpty()
    name!: string;


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
