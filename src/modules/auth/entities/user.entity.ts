import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "@modules/auth/entities/userRole.entity";

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    email: string;

    @Column({ select: false })
    password: string;
    
    @ManyToOne(() => UserRole)
    @JoinColumn({ name: 'roleId' })
    role: UserRole;
}