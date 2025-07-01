import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from '../products/entities/product.entity';
import { Express } from 'express';

@Injectable()
export class FilesService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async uploadProductImage(id: string, file: Express.Multer.File) {
        // Buscar el producto
        const product = await this.productRepository.findOne({
            where: { id }
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Si el producto ya tiene una imagen, eliminarla de Cloudinary
        if (product.imgUrl && product.imgUrl !== 'https://via.placeholder.com/150') {
            const publicId = this.getPublicIdFromUrl(product.imgUrl);
            await this.cloudinaryService.deleteImage(publicId);
        }

        // Subir la nueva imagen a Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImage(file);

        // Actualizar la URL de la imagen en el producto
        product.imgUrl = uploadResult.secure_url;
        await this.productRepository.save(product);

        return {
            message: 'Image uploaded successfully',
            product: {
                id: product.id,
                name: product.name,
                imgUrl: product.imgUrl
            }
        };
    }

    async uploadProductImageByUrl(id: string, imageUrl: string) {
        const product = await this.productRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Si el producto ya tenía una imagen, eliminarla de Cloudinary
        if (product.imgUrl && product.imgUrl !== 'https://via.placeholder.com/150') {
            const publicId = this.getPublicIdFromUrl(product.imgUrl);
            await this.cloudinaryService.deleteImage(publicId);
        }

        // Subir la imagen desde la URL a Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImageFromUrl(imageUrl);

        // Guardar la nueva URL en el producto
        product.imgUrl = uploadResult.secure_url;
        await this.productRepository.save(product);

        return {
            message: 'Image uploaded from URL successfully',
            product: {
                id: product.id,
                name: product.name,
                imgUrl: product.imgUrl
            }
        };
    }

    private getPublicIdFromUrl(url: string): string {
        // Extraer el public_id de la URL de Cloudinary
        const splitUrl = url.split('/');
        const filename = splitUrl[splitUrl.length - 1];
        return filename.split('.')[0];
    }
}