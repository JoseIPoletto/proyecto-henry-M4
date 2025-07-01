import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'serena.tsukino@luna.moon',
    description: 'Correo electrónico del usuario'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'MoonPrism123!',
        description: 'Contraseña del usuario',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
} 