import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Folder } from "@modules/folders/entities/folder.entity";
import { Repository } from "typeorm";
import { FolderColor } from "@modules/folders/entities/folderColor.entity";
import { Document } from "@modules/documents/entities/document.entity";
import { UpdateFolderDto } from "@modules/folders/dtos/updateFolder.dto";
import { IFolderData } from "@modules/folders/interfaces/folderData.interface";

@Injectable()
export class FoldersService {
    constructor(
        @InjectRepository(Folder)
        private readonly foldersRepository: Repository<Folder>,
        @InjectRepository(FolderColor)
        private readonly folderColorsRepository: Repository<FolderColor>,
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    async getFolders() {
        return this.foldersRepository.find();
    }

    async getFolderById(id: string) {
        const folder = await this.foldersRepository.findOne({
            where: { id },
            relations: {
                order: {
                    customer: true,
                },
                documents: true,
            },
        });

        if (!folder)
            throw new NotFoundException('Folder not found');

        return folder;
    }

    async createFolder(folderData: IFolderData) {
        const folder = this.foldersRepository.create({
            name: folderData.name,
            copies: folderData.copies,
            price: 0,
            color: folderData.color,
            order: folderData.order,
        });

        return this.foldersRepository.save(folder);
    }

    async updateFolder(folder: Folder, folderData: UpdateFolderDto) {
        const color = folderData.colorName && (
            await this.folderColorsRepository.findOneByOrFail({
                name: folderData.colorName,
            })
        );

        await this.foldersRepository.update(folder.id, {
            name: folderData.name,
            copies: folderData.copies,
            color,
        });
    }

    async updateFolderPriceOrDelete(folderId: string) {
        const folder = await this.foldersRepository.findOneOrFail({
            where: {
                id: folderId,
            },
            relations: {
                color: true,
                documents: true,
            },
        });

        if (!folder.documents.length) {
            await this.foldersRepository.delete(folder.id);

            return;
        }

        const folderPrice = folder.documents.reduce(
            (sum, document) => {
                sum += document.pages * folder.color.unitPrice * folder.copies;

                return sum;
            }, 0
        );

        await this.foldersRepository.update(folder.id, {
            price: folderPrice,
        });
    }

    async deleteFolder(folder: Folder) {
        await this.documentsRepository.delete({
            folder: {
                id: folder.id,
            },
        });

        await this.foldersRepository.delete(folder.id);
    }
}