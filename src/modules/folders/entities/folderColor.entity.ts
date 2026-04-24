import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColorName } from "@modules/folders/interfaces/colorName.enum";

@Entity('FolderColor')
export class FolderColor {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column()
    name: ColorName;

    @Column('int')
    unitPrice: number;
}