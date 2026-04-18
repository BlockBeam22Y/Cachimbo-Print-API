import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { DocumentsService } from "@modules/documents/documents.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { diskStorage } from 'multer';
import { fileNamer } from "@modules/files/helpers/fileNamer.helper";
import { documentFileFilter } from "@modules/documents/helpers/documentFileFilter.helper";
import { join } from "path";
import { rootPath } from "@config/envs";
import { FoldersService } from "@modules/folders/services/folders.service";
import { OrdersService } from "@modules/orders/orders.service";
import { Request } from "express";
import { UploadDocumentDto } from "@modules/documents/dtos/uploadDocument.dto";
import { AuthGuard } from "@modules/auth/guards/auth.guard";

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

    @UseGuards(AuthGuard)
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
        @Body() documentData: UploadDocumentDto,
        @Req() req: Request,
    ) {
        try {
            const { folderId } = documentData;
            const user = req['user'];
    
            const folder = await this.foldersService.getFolderById(folderId);
            if (folder.order.customer.id !== user.id)
                throw new ForbiddenException('Forbidden access');
            
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
                uploadedFiles: filesData.length,
                folderId: folder.id,
                orderId: folder.order.id,
            };
        } catch(err) {
            files.forEach(async (file) => {
                const fileId = file.filename.split('.')[0];

                await this.filesService.deleteFile(fileId);
            });

            throw err;
        }
    }
    
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteDocument(@Param('id') id: string, @Req() req: Request) {
        const document = await this.documentsService.getDocumentById(id);
        const user = req['user'];

        if (document.folder.order.customer.id !== user.id)
            throw new ForbiddenException('Forbidden access');

        await this.documentsService.deleteDocument(document);
        await this.filesService.deleteFile(document.id);

        await this.foldersService.updateFolderPrice(document.folder.id);
        await this.ordersService.updateOrderPrice(document.folder.order.id);

        return {
            deleted: true,
            id,
        };
    }
}