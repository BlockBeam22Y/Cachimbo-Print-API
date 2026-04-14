import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FolderColor } from "./folderColor.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity('Folder')
export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column('int')
    copies: number;

    @Column('int')
    price: number;

    @ManyToOne(() => FolderColor)
    @JoinColumn({ name: 'colorId' })
    color: FolderColor;

    @ManyToOne(() => Order, (order) => order.folders)
    @JoinColumn({ name: 'orderId' })
    order: Order;
}