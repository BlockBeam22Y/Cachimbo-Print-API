import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";

@Entity({ name: 'CustomerAddress' })
export class CustomerAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    lat: string;
    
    @Column()
    lng: string;

    @Column()
    postalCode: string;

    @ManyToOne(() => Customer, (customer) => customer.addresses)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;
}