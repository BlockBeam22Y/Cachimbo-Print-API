import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Folder } from "../entities/folder.entity";
import { Repository } from "typeorm";
import { FolderColor } from "../entities/folderColor.entity";
import { CreateFolderDto } from "../dtos/createFolder.dto";
import { Order } from "../../orders/entities/order.entity";

@Injectable()
export class FoldersService {
    constructor(
        @InjectRepository(Folder)
        private readonly foldersRepository: Repository<Folder>,
        @InjectRepository(FolderColor)
        private readonly folderColorsRepository: Repository<FolderColor>,
    ) {}

    async getFolders() {
        return this.foldersRepository.find();
    }

    async getFolderById(id: string) {
        const folder = await this.foldersRepository.findOneBy({ id });

        if (!folder)
            throw new NotFoundException('Folder not found');

        return folder;
    }

    async createFolder(folderData: CreateFolderDto, color: FolderColor, order: Order) {
        const folder = this.foldersRepository.create({
            name: folderData.name,
            copies: folderData.copies,
            price: 0,
            color,
            order,
        });

        return this.foldersRepository.save(folder);
    }
}