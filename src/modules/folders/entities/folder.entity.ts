import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FolderColor } from "@modules/folders/entities/folderColor.entity";
import { Order } from "@modules/orders/entities/order.entity";
import { Document } from "@modules/documents/entities/document.entity";

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
    
    @OneToMany(() => Document, (document) => document.folder)
    documents: Document[];
}