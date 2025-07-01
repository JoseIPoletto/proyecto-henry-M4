import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/entities/category.entity';
import { seedData } from '../data/seed-data';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async findAll(page: number = 1, limit: number = 10) {
        const [products, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                name: 'ASC'
            }
        });

        return {
            products,
            total,
            page,
            limit
        };
    }

    async findOne(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async create(createProductDto: CreateProductDto) {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async update(id: string, updateProductDto: CreateProductDto) {
        const product = await this.findOne(id);

        if ((updateProductDto as any).categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: (updateProductDto as any).categoryId }
            });

            if (!category) {
                throw new NotFoundException(`Category with ID ${(updateProductDto as any).categoryId} not found`);
            }

            product.category = category;
        }

        // Mergea el resto de propiedades (excluyendo categoryId para no pisar `category`)
        const { categoryId, ...rest } = updateProductDto as any;
        this.productRepository.merge(product, rest);

        return await this.productRepository.save(product);
    }

    async delete(id: string) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return { id };
    }

    async seedProducts() {
        try {
            const results: Product[] = [];
            const existingProducts: Product[] = [];

            for (const item of seedData) {
                const existingProduct = await this.productRepository.findOne({
                    where: { name: item.name },
                    relations: ['category']
                });

                if (!existingProduct) {
                    const category = await this.categoryRepository.findOne({
                        where: { name: item.category }
                    });

                    if (!category) {
                        throw new Error(`Category ${item.category} not found`);
                    }

                    const newProduct = this.productRepository.create({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        stock: item.stock,
                        category: category
                    });

                    await this.productRepository.save(newProduct);
                    results.push(newProduct);
                } else {
                    existingProducts.push(existingProduct);
                }
            }

            return {
                message: 'Products seeded successfully',
                productsCreated: results.length,
                products: existingProducts.length > 0 ? existingProducts : results
            };
        } catch (error) {
            throw new Error(`Error seeding products: ${error.message}`);
        }
    }
}
