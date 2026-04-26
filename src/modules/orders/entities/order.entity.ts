import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { Folder } from "@modules/folders/entities/folder.entity";
import { OrderDetail } from "./orderDetail.entity";

@Entity('Order')
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('int')
    totalPrice: number;

    @Column()
    status: string;

    @OneToOne(() => OrderDetail, {
        nullable: true,
    })
    @JoinColumn({ name: 'detailId' })
    detail?: OrderDetail;
    
    @ManyToOne(() => Customer, (customer) => customer.orders, {
        nullable: true,
    })
    @JoinColumn({ name: 'customerId' })
    customer?: Customer;

    @OneToMany(() => Folder, (folder) => folder.order)
    folders: Folder[];
}