import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { Folder } from "@modules/folders/entities/folder.entity";

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

    @OneToMany(() => Folder, (folder) => folder.order)
    folders: Folder[];
}