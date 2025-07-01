import { Controller, Get, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Obtener estado de autenticación' })
    @ApiResponse({ 
        status: 200, 
        description: 'Estado de autenticación obtenido correctamente',
        schema: {
            example: {
                message: 'Estado de autenticación'
            }
        }
    })
    getStatus() {
        return {
            message: 'Estado de autenticación'
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Iniciar sesión',
        description: 'Permite a un usuario iniciar sesión con su email y contraseña'
    })
    @ApiBody({
        type: LoginUserDto,
        description: 'Credenciales del usuario para iniciar sesión',
        required: true
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Login exitoso',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
               name: "Serena Tsukino",
               email: "serena.tsukino@luna.moon",
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Credenciales incorrectas',
        schema: {
            example: {
                statusCode: 401,
                message: 'Email o contraseña incorrectos',
                error: 'Unauthorized'
            }
        }
    })
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Registrar nuevo usuario',
        description: 'Crea una nueva cuenta de usuario con los datos proporcionados'
    })
    @ApiBody({
        type: RegisterDto,
        description: 'Datos del nuevo usuario',
        required: true
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Usuario creado exitosamente',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Juan Pérez',
                email: 'juan.perez@ejemplo.com',
                address: 'Calle Principal 123',
                phone: 123456789,
                country: 'Argentina',
                createdAt: '2024-05-25T15:30:00.000Z',
                updatedAt: '2024-05-25T15:30:00.000Z'
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Datos inválidos',
        schema: {
            example: {
                statusCode: 400,
                message: ['El email debe ser válido', 'La contraseña debe cumplir con los requisitos'],
                error: 'Bad Request'
            }
        }
    })
    @ApiResponse({ 
        status: 409, 
        description: 'El email ya está registrado',
        schema: {
            example: {
                statusCode: 409,
                message: 'El email ya está registrado',
                error: 'Conflict'
            }
        }
    })
    async signup(@Body() registerDto: RegisterDto) {
        return await this.usersService.create(registerDto);
    }
}
