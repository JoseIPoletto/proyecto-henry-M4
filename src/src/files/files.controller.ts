import { Controller, Post, Patch, Param, UseInterceptors, UploadedFile, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ValidateUUID } from '../common/decorators/uuid.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadImageUrlDto } from '../files/dto/files.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('uploadImage/:id')
    @Auth()
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Subir imagen de un producto' })
    @ApiResponse({ 
        status: 200, 
        description: 'Imagen subida exitosamente',
        schema: {
            example: {
                id: 'uuid',
                name: 'Samsung Galaxy S23',
                imgUrl: 'https://res.cloudinary.com/example/image/upload/v1234567890/products/image.jpg'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Archivo inválido o no proporcionado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async uploadProductImage(
        @ValidateUUID() @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.filesService.uploadProductImage(id, file);
    }

    @Patch('uploadImageUrl/:id')
    @Auth()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar imagen de producto desde una URL' })
    @ApiResponse({
        status: 200,
        description: 'Imagen subida desde URL exitosamente',
        schema: {
            example: {
                message: 'Image uploaded from URL successfully',
                product: {
                    id: 'uuid',
                    name: 'iPhone 14',
                    imgUrl: 'https://res.cloudinary.com/example/image/upload/v1234567890/products/image.jpg'
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'URL inválida' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async uploadProductImageByUrl(
        @ValidateUUID() @Param('id') id: string,
        @Body() body: UploadImageUrlDto
    ) {
        return this.filesService.uploadProductImageByUrl(id, body.imageUrl);
    }
}