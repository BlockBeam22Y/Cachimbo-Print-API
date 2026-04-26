import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'OrderDetail' })
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    lat: string;

    @Column()
    lng: string;

    @Column()
    postalCode: string;
}