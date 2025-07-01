import { Controller, Get, Post, Put, Delete, Body, HttpStatus, HttpCode, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateUUID } from '../common/decorators/uuid.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
   
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener lista de usuarios paginada' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de usuarios obtenida exitosamente',
        schema: {
            example: {
                users: [
                    {
                        id: 'uuid',
                        name: 'Juan Pérez',
                        email: 'juan.perez@ejemplo.com',
                        address: 'Calle Principal 123',
                        phone: 123456789,
                        country: 'Argentina'
                    }
                ],
                total: 1,
                page: 1,
                limit: 5
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '5') {
        return this.usersService.findAll(
            parseInt(page),
            parseInt(limit)
        );
    }

    @Get(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario encontrado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Juan Pérez',
                email: 'juan.perez@ejemplo.com',
                address: 'Calle Principal 123',
                phone: 123456789,
                country: 'Argentina'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    findOne(@Param('id') @ValidateUUID() id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ 
        status: 201, 
        description: 'Usuario creado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Juan Pérez',
                email: 'juan.perez@ejemplo.com',
                address: 'Calle Principal 123',
                phone: 123456789,
                country: 'Argentina'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de usuario inválidos' })
    @ApiResponse({ status: 409, description: 'El email ya está registrado' })
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @Post('admin')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo usuario administrador' })
    @ApiResponse({ 
        status: 201, 
        description: 'Usuario administrador creado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Admin User',
                email: 'admin@ejemplo.com',
                address: 'Calle Principal 123',
                phone: 123456789,
                country: 'Argentina',
                isAdmin: true
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de usuario inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 409, description: 'El email ya está registrado' })
    createAdmin(@Body() user: CreateUserDto) {
        return this.usersService.createAdmin(user);
    }

    @Put(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un usuario por ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del usuario (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiBody({
        type: UpdateUserDto,
        description: 'Datos para actualizar el usuario'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario actualizado exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Juan Pérez Actualizado',
                email: 'juan.perez@ejemplo.com',
                address: 'Nueva Calle 456',
                phone: 987654321,
                country: 'Argentina'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    update(
        @Param('id') @ValidateUUID() id: string,
        @Body() user: UpdateUserDto
    ) {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un usuario por ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del usuario (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario eliminado exitosamente'
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    delete(@Param('id') @ValidateUUID() id: string) {
        return this.usersService.delete(id);
    }
}
