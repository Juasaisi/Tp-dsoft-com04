import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class RegistroDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}