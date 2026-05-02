import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    email: string;

    @Column({ select: false })
    password: string;
}