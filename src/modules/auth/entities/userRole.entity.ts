import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'UserRole' })
export class UserRole {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column('bigint')
    permissionBitField: bigint;
}