import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class VentaDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    idventa!: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    idcliente!: number;

    @IsString()
    @IsNotEmpty()
    fecha!: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    total!: number;

    @IsBoolean()
    @IsOptional()
    delete?: boolean;
}