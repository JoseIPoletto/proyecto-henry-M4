import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Product } from '../products/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        CloudinaryModule
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {} 