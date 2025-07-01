import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetail, Product, User])
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule {} 