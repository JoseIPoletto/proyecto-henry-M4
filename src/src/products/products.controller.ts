import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ValidateUUID } from '../common/decorators/uuid.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener lista de productos paginada' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de productos obtenida exitosamente',
        schema: {
            example: {
                products: [
                    {
                        id: 'uuid',
                        name: 'Samsung Galaxy S23',
                        description: 'Último modelo de Samsung con cámara de 200MP',
                        price: 150.00,
                        stock: 9,
                        imgUrl: 'https://ejemplo.com/imagen.jpg'
                    }
                ],
                total: 1,
                page: 1,
                limit: 10
            }
        }
    })
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        return this.productsService.findAll(
            parseInt(page),
            parseInt(limit)
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener un producto por ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del producto (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto encontrado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Samsung Galaxy S23',
                description: 'Último modelo de Samsung con cámara de 200MP',
                price: 150.00,
                stock: 9,
                imgUrl: 'https://ejemplo.com/imagen.jpg'
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    findOne(@Param('id') @ValidateUUID() id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ 
        status: 201, 
        description: 'Producto creado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Samsung Galaxy S23',
                description: 'Último modelo de Samsung con cámara de 200MP',
                price: 150.00,
                stock: 9,
                imgUrl: 'https://ejemplo.com/imagen.jpg'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de producto inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    create(@Body() product: CreateProductDto) {
        return this.productsService.create(product);
    }

    @Put(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un producto por ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del producto (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto actualizado exitosamente',
        schema: {
            example: {
                id: "d3e7a359-b2b0-41d7-8064-9e8ca5342af7",
                name: "producto con 1 de stock",
                description: "Descripción del producto",
                price: 999.99,
                stock: 1,
                imgUrl: "https://res.cloudinary.com/ddqn3ccce/image/upload/v1750716824/lx3i9pststn7xa25we66.jpg",
                categoryId: "f901cdae-ff93-4a03-9c6d-2a2509f82d0f"
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    update(@Param('id') @ValidateUUID() id: string, @Body() product: CreateProductDto) {
        return this.productsService.update(id, product);
    }

    @Delete(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un producto por ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del producto (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto eliminado exitosamente'
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    delete(@Param('id') @ValidateUUID() id: string) {
        return this.productsService.delete(id);
    }

    @Get('seeder')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generar productos de prueba' })
    @ApiResponse({ 
        status: 200, 
        description: 'Productos de prueba generados exitosamente'
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    seedProducts() {
        return this.productsService.seedProducts();
    }
}
