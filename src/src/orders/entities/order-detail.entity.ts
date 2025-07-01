import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_details')
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total: number;

    @OneToOne(() => Order, order => order.orderDetail)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'order_detail_products',
        joinColumn: {
            name: 'order_detail_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        }
    })
    products: Product[];
} 