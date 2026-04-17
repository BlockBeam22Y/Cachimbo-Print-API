import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { Repository } from "typeorm";
import { IFileData } from "./interfaces/fileData.interface";
import { Folder } from "../folders/entities/folder.entity";

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    async getDocuments() {
        return this.documentsRepository.find();
    }

    async uploadDocuments(filesData: IFileData[], folder: Folder) {
        const documents = filesData.map((fileData) => {
            const document = this.documentsRepository.create({
                id: fileData.id,
                name: fileData.name,
                pages: fileData.pages,
                fileUrl: fileData.fileUrl,
                previewUrl: fileData.previewUrl,
                folder,
            });
            
            return document;
        });

        return this.documentsRepository.save(documents);
    }
}