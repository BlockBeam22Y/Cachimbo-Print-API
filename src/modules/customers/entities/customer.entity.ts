import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "@modules/orders/entities/order.entity";

@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ select: false })
    password: string;
    
    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}