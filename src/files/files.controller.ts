import { Controller, Post, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('uploadImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProductImage(
        @Param('id') id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return await this.filesService.uploadProductImage(id, file);
    }
} 