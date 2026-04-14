import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Folder } from "../entities/folder.entity";
import { Repository } from "typeorm";
import { FolderColor } from "../entities/folderColor.entity";

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
}