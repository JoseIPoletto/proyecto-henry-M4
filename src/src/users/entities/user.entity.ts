import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 60, nullable: false })
    password: string;

    @Column({ type: 'integer' })
    phone: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    country: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    city: string;

    @Column({ type: 'boolean', default: false })
    isAdmin: boolean;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
} 