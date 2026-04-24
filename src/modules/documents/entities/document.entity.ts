import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Folder } from "@modules/folders/entities/folder.entity";

@Entity('Document')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column('int')
    pages: number;
    
    @Column()
    fileUrl: string;

    @Column()
    previewUrl: string;

    @ManyToOne(() => Folder, (folder) => folder.documents)
    @JoinColumn({ name: 'folderId' })
    folder: Folder;
}