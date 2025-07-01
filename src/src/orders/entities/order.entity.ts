import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetail: OrderDetail;
} 