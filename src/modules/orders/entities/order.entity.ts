import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";

@Entity('Order')
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('int')
    totalPrice: number;

    @Column()
    status: string;
    
    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;
}