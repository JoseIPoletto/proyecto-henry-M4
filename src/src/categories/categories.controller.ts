import { Controller, Get, HttpStatus, HttpCode, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto } from '../categories/dto/categories.dto';


@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de categorías obtenida exitosamente',
        schema: {
            example: [
                {
                    id: 'uuid',
                    name: 'Smartphones',
                    description: 'Teléfonos móviles inteligentes'
                },
                {
                    id: 'uuid',
                    name: 'Laptops',
                    description: 'Computadoras portátiles'
                }
            ]
        }
    })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get('seeder')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generar categorías de prueba' })
    @ApiResponse({ 
        status: 200, 
        description: 'Categorías de prueba generadas exitosamente',
        schema: {
            example: {
                message: 'Categories seeded successfully',
                categoriesCreated: 5
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    seedCategories() {
        return this.categoriesService.seedCategories();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({
      status: 201,
      description: 'Categoría creada exitosamente',
      schema: {
        example: {
          id: 'uuid',
          name: 'Tablets',
          description: 'Dispositivos táctiles portátiles'
        }
      }
    })
    create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoriesService.create(createCategoryDto);
    }
}