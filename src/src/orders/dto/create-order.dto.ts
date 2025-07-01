import { IsUUID, IsArray, ValidateNested, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductIdDto {
  @IsUUID()
  id: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'b0aceac2-a9d2-48d2-a330-7d4259c004f1',
    description: 'ID del usuario que realiza la orden'
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: [ProductIdDto],
    description: 'Lista de productos en la orden'
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductIdDto)
  products: ProductIdDto[];
}