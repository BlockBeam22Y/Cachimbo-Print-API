import { Injectable, OnModuleInit } from "@nestjs/common";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { IFileData } from "@modules/documents/interfaces/fileData.interface";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { connectionString, rootPath } from "@config/envs";
import { join } from "path";
import { mkdir, readFile } from "fs/promises";
import { load } from "@nutrient-sdk/node";

@Injectable()
export class CloudStorageService implements IFilesService, OnModuleInit {
    private readonly blobServiceClient: BlobServiceClient;
    private readonly documentsContainerClient: ContainerClient;
    private readonly previewsContainerClient: ContainerClient;

    constructor() {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        this.documentsContainerClient = this.blobServiceClient.getContainerClient('documents');
        this.previewsContainerClient = this.blobServiceClient.getContainerClient('previews');
    }

    async onModuleInit() {
        const folderPath = join(rootPath, '/static/uploads');

        await mkdir(folderPath, { recursive: true });
    }

    async saveFile(file: Express.Multer.File): Promise<IFileData> {
        const fileId = file.filename.split('.')[0];

        const doc = await readFile(file.path);
        const instance = await load({ document: doc });

        const documentInfo = instance.getDocumentInfo();
        const result = await instance.renderPage(
            0,
            { width: documentInfo.pages[0].width },
            'webp',
        );

        const documentBlockBlobClient = this.documentsContainerClient.getBlockBlobClient(`${fileId}.pdf`);
        await documentBlockBlobClient.upload(doc, doc.byteLength);

        const previewBlockBlobClient = this.previewsContainerClient.getBlockBlobClient(`${fileId}.webp`);
        await previewBlockBlobClient.upload(result, result.byteLength);

        return {
            id: fileId,
            name: file.originalname,
            pages: documentInfo.pageCount,
            fileUrl: documentBlockBlobClient.url,
            previewUrl: previewBlockBlobClient.url,
        };
    }

    async deleteFile(fileId: string): Promise<void> {
        const documentBlockBlobClient = this.documentsContainerClient.getBlockBlobClient(`${fileId}.pdf`);
        await documentBlockBlobClient.deleteIfExists();

        const previewBlockBlobClient = this.previewsContainerClient.getBlockBlobClient(`${fileId}.webp`);
        await previewBlockBlobClient.deleteIfExists();
    }
}