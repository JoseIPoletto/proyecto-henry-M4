import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { seedData } from '../data/seed-data';
import { CreateCategoryDto } from '../categories/dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async findAll() {
        return await this.categoryRepository.find();
    }

    async seedCategories() {
        try {
            const uniqueCategories = [...new Set(seedData.map(item => item.category))];
            const results: Category[] = [];
            const existingCategories: Category[] = [];
            
            for (const categoryName of uniqueCategories) {
                const existingCategory = await this.categoryRepository.findOne({
                    where: { name: categoryName as string }
                });

                if (!existingCategory) {
                    const newCategory = this.categoryRepository.create({
                        name: categoryName as string
                    });
                    await this.categoryRepository.save(newCategory);
                    results.push(newCategory);
                } else {
                    existingCategories.push(existingCategory);
                }
            }
            
            return {
                message: 'Categories seeded successfully',
                categoriesCreated: results.length,
                categories: existingCategories.length > 0 ? existingCategories : results
            };
        } catch (error) {
            throw new Error(`Error seeding categories: ${error.message}`);
        }
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const newCategory = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(newCategory);
    }
}