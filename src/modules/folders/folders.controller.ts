import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { FoldersService } from "@modules/folders/services/folders.service";
import { OrdersService } from "@modules/orders/orders.service";
import { CreateFolderDto } from "@modules/folders/dtos/createFolder.dto";
import { FolderColorsService } from "@modules/folders/services/folderColors.service";
import { Request } from "express";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { UpdateFolderDto } from "@modules/folders/dtos/updateFolder.dto";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";

@Controller('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
        private readonly folderColorsService: FolderColorsService,
        @Inject(IFilesService)
        private readonly filesServices: IFilesService,
        private readonly ordersService: OrdersService,
    ) {}

    @Get()
    async getFolders() {
        return this.foldersService.getFolders();
    }

    // @UseGuards(AuthGuard)
    // @Post()
    // async createFolder(
    //     @Body() folderData: CreateFolderDto,
    //     @Req() req: Request,
    // ) {
    //     const { colorName, orderId } = folderData;
    //     const user = req['user'];

    //     const order = await this.ordersService.getOrderById(orderId);
    //     if (order.customer.id !== user.id)
    //         throw new ForbiddenException('Forbidden access');

    //     if (order.status !== OrderStatus.PENDING)
    //         throw new BadRequestException('Order is already being processed');
        
    //     const color = await this.folderColorsService.getColorByName(colorName);
    //     return this.foldersService.createFolder(folderData, color, order)
    // }

    @UseGuards(AuthGuard)
    @Put('/:id')
    async updateFolder(
        @Param('id') id: string,
        @Body() folderData: UpdateFolderDto,
        @Req() req: Request,
    ) {
        const folder = await this.foldersService.getFolderById(id);
        const user = req['user'];

        if (folder.order.customer.id != user.id)
            throw new ForbiddenException('Forbidden access');

        if (folder.order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.foldersService.updateFolder(folder, folderData);
        await this.foldersService.updateFolderPriceOrDelete(folder.id);

        return {
            updated: true,
            id,
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteFolder(@Param('id') id: string, @Req() req: Request) {
        const folder = await this.foldersService.getFolderById(id);
        const user = req['user'];

        if (folder.order.customer.id !== user.id)
            throw new ForbiddenException('Forbidden access');

        if (folder.order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.foldersService.deleteFolder(folder);
        
        for await (const document of folder.documents) {
            await this.filesServices.deleteFile(document.id);
        }

        await this.ordersService.updateOrderPriceOrDelete(folder.order.id);

        return {
            deleted: true,
            id,
        };
    }
}