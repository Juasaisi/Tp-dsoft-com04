import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class VentaDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    idventa?: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    idCliente!: number;

    @IsDateString()
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