import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { IFilesService } from "../interfaces/filesService.interface";
import { join } from "path";
import { existsSync } from "fs";
import { hostURL } from "../../../config/envs";

@Injectable()
export class LocalStorageService implements IFilesService {    
    async saveFile(file: Express.Multer.File): Promise<string> {
        return `${hostURL}/files/documents/${file.filename}`;
    }

    async generatePreview(file: Express.Multer.File): Promise<string> {
        return `${hostURL}/files/documents/${file.filename}`;
    }
}