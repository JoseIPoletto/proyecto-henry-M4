import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'integer', nullable: false })
    stock: number;

    @Column({ 
        type: 'varchar', 
        default: 'https://via.placeholder.com/150' 
    })
    imgUrl: string;

     @Column({ type: 'boolean', default: false })
    isOffer: boolean;

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToMany(() => OrderDetail)
    @JoinTable()
    orderDetails: OrderDetail[];
} 