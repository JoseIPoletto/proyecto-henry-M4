import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Product } from '../products/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            // Usando almacenamiento en memoria para tener acceso al buffer
            storage: undefined
        }),
        TypeOrmModule.forFeature([Product]),
        CloudinaryModule
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {} 