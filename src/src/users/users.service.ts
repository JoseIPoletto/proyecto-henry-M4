import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findAll(page: number = 1, limit: number = 5) {
        const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            select: ['id', 'email', 'name', 'phone', 'country', 'address', 'city', 'isAdmin']
        });

        return {
            data: users,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    }

    async findOne(id: string) {
        return await this.userRepository.findOne({ 
            where: { id },
            select: ['id', 'email', 'name', 'phone', 'country', 'address', 'city', 'isAdmin']
        });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ 
            where: { email }
        });
    }

    async create(createUserDto: CreateUserDto) {
        // Verificar si el email ya existe
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Crear el usuario con la contraseña hasheada
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            isAdmin: false // Por defecto, los usuarios no son administradores
        });

        return await this.userRepository.save(user);
    }

    async createAdmin(createUserDto: CreateUserDto) {
        // Verificar si el email ya existe
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Crear el usuario administrador
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            isAdmin: true // Este usuario será administrador
        });

        return await this.userRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.userRepository.update(id, updateUserDto);
         return await this.findOne(id);
    }

    async delete(id: string) {
        await this.userRepository.delete(id);
        return { id };
    }
}
