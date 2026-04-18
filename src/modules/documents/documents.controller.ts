import { Body, Controller, Get, Inject, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IFilesService } from "../files/interfaces/filesService.interface";
import { diskStorage } from 'multer';
import { fileNamer } from "../files/helpers/fileNamer.helper";
import { documentFileFilter } from "./helpers/documentFileFilter.helper";
import { join } from "path";
import { rootPath } from "../../config/envs";
import { FoldersService } from "../folders/services/folders.service";
import { OrdersService } from "../orders/orders.service";

@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
        private readonly foldersService: FoldersService,
        private readonly ordersService: OrdersService,
    ) {}

    @Get()
    async getDocuments() {
        return this.documentsService.getDocuments();
    }

    @Post('/upload')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            fileFilter: documentFileFilter,
            storage: diskStorage({
                filename: fileNamer,
                destination: join(rootPath, '/.tmp/documents'),
            }),
        }),
    )
    async uploadDocuments(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body('folderId') folderId: string,
    ) {
        const folder = await this.foldersService.getFolderById(folderId);
        
        const filesData = await Promise.all(
            files.map(async (file) => {
                const fileData = await this.filesService.saveFile(file);

                return fileData;
            }),
        );

        await this.documentsService.uploadDocuments(filesData, folder);
        
        await this.foldersService.updateFolderPrice(folder.id);
        await this.ordersService.updateOrderPrice(folder.order.id);

        return {
            updated: true,
            folderId: folder.id,
            orderId: folder.order.id,
        };
    }
}