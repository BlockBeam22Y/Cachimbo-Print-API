import { Injectable, OnModuleInit } from "@nestjs/common";
import { IFilesService } from "../interfaces/filesService.interface";
import { join } from "path";
import { hostURL, rootPath } from "../../../config/envs";
import { IFileData } from "../../documents/interfaces/fileData.interface";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { load } from "@nutrient-sdk/node";
import { existsSync } from "fs";

@Injectable()
export class LocalStorageService implements IFilesService, OnModuleInit {
    async onModuleInit() {
        const folderPath = join(rootPath, '/.tmp');

        await mkdir(join(folderPath, '/documents'), { recursive: true });
        await mkdir(join(folderPath, '/previews'), { recursive: true });
    }
    
    async saveFile(file: Express.Multer.File): Promise<IFileData> {
        const filePath = join(rootPath, '/.tmp/documents', file.filename);
        const doc = await readFile(filePath);

        const instance = await load({ document: doc });;
        const documentInfo = instance.getDocumentInfo();
        const result = await instance.renderPage(
            0,
            { width: documentInfo.pages[0].width },
            'webp',
        );

        const fileId = file.filename.split('.')[0];
        const previewPath = join(rootPath, '/.tmp/previews', `${fileId}.webp`);

        await writeFile(previewPath, Buffer.from(result));
        instance.close();

        return {
            id: fileId,
            name: file.originalname,
            pages: documentInfo.pageCount,
            fileUrl: `${hostURL}/files/documents/${fileId}.pdf`,
            previewUrl: `${hostURL}/files/previews/${fileId}.webp`,
        };
    }

    async deleteFile(file: Express.Multer.File): Promise<void> {
        const filePath = join(rootPath, '/.tmp/documents', file.filename);
        if (existsSync(filePath))
            await unlink(filePath);

        const fileId = file.filename.split('.')[0];
        const previewPath = join(rootPath, '/.tmp/previews', `${fileId}.webp`);

        if (existsSync(previewPath))
            await unlink(previewPath);
    }
}