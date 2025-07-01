import { Controller, Get, Post, Body, HttpStatus, HttpCode, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ValidateUUID } from '../common/decorators/uuid.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva orden de compra' })
    @ApiResponse({ 
        status: 201, 
        description: 'Orden creada exitosamente',
        schema: {
            example: {
                id: 'uuid',
                total: 150.00,
                userId: 'uuid',
                orderDetailId: 'uuid',
                products: [
                    {
                        id: 'uuid',
                        name: 'Samsung Galaxy S23',
                        price: 150.00
                    }
                ]
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de orden inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async addOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.addOrder(createOrderDto);
    }

    @Get(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener una orden por ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Orden encontrada exitosamente',
        schema: {
            example: {
                id: 'uuid',
                total: 150.00,
                createdAt: '2025-05-26T12:07:16.000Z',
                user: {
                    id: 'uuid',
                    name: 'Juan Pérez',
                    email: 'juan.perez@ejemplo.com'
                },
                products: [
                    {
                        id: 'uuid',
                        name: 'Samsung Galaxy S23',
                        price: 150.00
                    }
                ]
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Orden no encontrada' })
    async getOrder(@Param('id') @ValidateUUID() id: string) {
        return this.ordersService.getOrder(id);
    }
}