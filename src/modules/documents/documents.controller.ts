import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";
import { Folder } from "@modules/folders/entities/folder.entity";
import { Order } from "@modules/orders/entities/order.entity";
import { CustomersService } from "@modules/customers/customers.service";
import { FolderColorsService } from "@modules/folders/services/folderColors.service";
import { unlink } from "fs/promises";

@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
        private readonly foldersService: FoldersService,
        private readonly folderColorsService: FolderColorsService,
        private readonly ordersService: OrdersService,
        private readonly customersService: CustomersService,
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
                destination: join(rootPath, '/static/uploads'),
            }),
        }),
    )
    async uploadDocuments(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() documentData: UploadDocumentDto,
        @Req() req: Request,
    ) {
        try {
            const user = req['user'];

            let folder: Folder;
            let order: Order;

            if (documentData.folderId) {
                folder = await this.foldersService.getFolderById(documentData.folderId);

                if (folder.order.customer.id !== user.id)
                    throw new ForbiddenException('Forbidden access');

                if (folder.order.status !== OrderStatus.PENDING)
                    throw new BadRequestException('Order is already being processed');
                
                order = folder.order;
            } else {
                if (documentData.orderId) {
                    order = await this.ordersService.getOrderById(documentData.orderId);
                    
                    if (order.customer.id !== user.id)
                        throw new ForbiddenException('Forbidden access');

                    if (order.status !== OrderStatus.PENDING)
                        throw new BadRequestException('Order is already being processed');
                } else {
                    const customer = await this.customersService.getCustomerById(user.id);
                    order = await this.ordersService.createOrder(customer);
                }

                const color = await this.folderColorsService.getColorByName(documentData.colorName);
                folder = await this.foldersService.createFolder({
                    name: documentData.name,
                    copies: documentData.copies,
                    color,
                    order,
                });
            }
            
            const filesData = await Promise.all(
                files.map(async (file) => {
                    const fileData = await this.filesService.saveFile(file);
    
                    return fileData;
                }),
            );
    
            await this.documentsService.uploadDocuments(filesData, folder);
            
            await this.foldersService.updateFolderPriceOrDelete(folder.id);
            await this.ordersService.updateOrderPriceOrDelete(order.id);
    
            return {
                uploadedFiles: filesData.length,
                folderId: folder.id,
                orderId: order.id,
            };
        } finally {
            for await (const file of files) {
                await unlink(file.path);
            }
        }
    }
    
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteDocument(@Param('id') id: string, @Req() req: Request) {
        const document = await this.documentsService.getDocumentById(id);
        const user = req['user'];

        if (document.folder.order.customer.id !== user.id)
            throw new ForbiddenException('Forbidden access');

        if (document.folder.order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.documentsService.deleteDocument(document);
        await this.filesService.deleteFile(document.id);

        await this.foldersService.updateFolderPriceOrDelete(document.folder.id);
        await this.ordersService.updateOrderPriceOrDelete(document.folder.order.id);

        return {
            deleted: true,
            id,
        };
    }
}