import { IsString, IsNumber, IsUrl, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        example: 'iPhone 14 Pro',
        description: 'Nombre del producto'
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Último modelo de iPhone con cámara de 48MP',
        description: 'Descripción detallada del producto'
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 999.99,
        description: 'Precio del producto',
        minimum: 0
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        example: 100,
        description: 'Cantidad disponible en stock',
        minimum: 0
    })
    @IsNumber()
    @Min(0)
    stock: number;

    @IsBoolean()
    isOffer: boolean;

    @ApiProperty({
        example: 'https://ejemplo.com/imagen.jpg',
        description: 'URL de la imagen del producto'
    })
    @IsUrl()
    imgUrl: string;
} 