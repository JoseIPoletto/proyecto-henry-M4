import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
        minLength: 3,
        maxLength: 80,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(80)
    name: string;

    @ApiProperty({
        example: 'juan.perez@ejemplo.com',
        description: 'Correo electrónico del usuario',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Contraseña segura (8-15 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial)',
        minLength: 8,
        maxLength: 15,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(15)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
        {
            message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)'
        }
    )
    password: string;

    @ApiProperty({
        example: 'Calle Principal 123',
        description: 'Dirección del usuario',
        minLength: 3,
        maxLength: 80,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(80)
    address: string;

    @ApiProperty({
        example: 123456789,
        description: 'Número de teléfono del usuario',
    })
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: 'Argentina',
        description: 'País de residencia',
        minLength: 5,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    country: string;

    @ApiProperty({
        example: 'Buenos Aires',
        description: 'Ciudad de residencia',
        minLength: 5,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    city: string;
}