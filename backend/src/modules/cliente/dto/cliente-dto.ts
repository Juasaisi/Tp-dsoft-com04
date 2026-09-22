import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, IsBoolean, IsOptional, Matches, Length } from "class-validator";

export class ClienteDto {


@IsString()
@IsNotEmpty()
@Matches(/^\d{7,8}$/, {
  message: 'El DNI debe contener 7 u 8 números',
})
dni!: string;

@IsString()
@IsNotEmpty()
 @Length(2, 50, {
    message:
      'El nombre debe tener entre 2 y 50 caracteres',
  })
name!: string;

@IsString()
@IsNotEmpty()
surname!: string;

@IsString()
@IsNotEmpty()
@Matches(/^\d{10}$/, {
  message: 'El teléfono debe contener 10 números',
})
phone!: string;

@IsEmail(
  {},
    {
      message: 'El email no tiene un formato válido',
    },
)
@IsNotEmpty()
email!: string;


//porque el cliente se crea activo y la baja se realiza mediante el endpoint DELETE.



}


 






