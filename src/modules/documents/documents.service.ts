import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { Repository } from "typeorm";
import { IFileData } from "./interfaces/fileData.interface";

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    async getDocuments() {
        return this.documentsRepository.find();
    }

    async uploadDocuments(filesData: IFileData[]) {
        return filesData;
    }
}