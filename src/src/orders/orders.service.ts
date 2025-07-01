import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async addOrder(createOrderDto: CreateOrderDto) {
        const user = await this.userRepository.findOne({
            where: { id: createOrderDto.userId }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${createOrderDto.userId} not found`);
        }

        // Buscar productos y verificar stock
        const products = await Promise.all(
            createOrderDto.products.map(async (product) => {
                const foundProduct = await this.productRepository.findOne({
                    where: { id: product.id }
                });

                if (!foundProduct) {
                    throw new NotFoundException(`Product with ID ${product.id} not found`);
                }

                if (foundProduct.stock <= 0) {
                    throw new BadRequestException(`Product ${foundProduct.name} is out of stock`);
                }

                return foundProduct;
            })
        );

        // Calcular total
        const total = products.reduce((sum, product) => sum + Number(product.price), 0);

        // Crear orden
        const order = this.orderRepository.create({
            user,
            total
        });
        await this.orderRepository.save(order);

        // Crear detalle de orden
        const orderDetail = this.orderDetailRepository.create({
            order,
            total,
            products
        });
        await this.orderDetailRepository.save(orderDetail);

        // Actualizar stock de productos
        await Promise.all(
            products.map(async (product) => {
                product.stock--;
                await this.productRepository.save(product);
            })
        );

        return {
            id: order.id,
            total: order.total,
            userId: user.id,
            orderDetailId: orderDetail.id,
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price
            }))
        };
    }

    async getOrder(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'orderDetail', 'orderDetail.products']
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return {
            id: order.id,
            total: order.total,
            createdAt: order.createdAt,
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email
            },
            products: order.orderDetail.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price
            }))
        };
    }
} 