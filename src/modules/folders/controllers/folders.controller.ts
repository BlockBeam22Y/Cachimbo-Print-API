import { BadRequestException, Body, Controller, Delete, ForbiddenException, Inject, Param, Put, Req, UseGuards } from "@nestjs/common";
import { FoldersService } from "@modules/folders/services/folders.service";
import { OrdersService } from "@modules/orders/services/orders.service";
import { Request } from "express";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { UpdateFolderDto } from "@modules/folders/dtos/updateFolder.dto";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";
import { IsPublic } from "@modules/auth/decorators/isPublic.decorator";

@Controller('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
        @Inject(IFilesService)
        private readonly filesServices: IFilesService,
        private readonly ordersService: OrdersService,
    ) {}

    @IsPublic()
    @UseGuards(AuthGuard)
    @Put('/:id')
    async updateFolder(
        @Param('id') id: string,
        @Body() folderData: UpdateFolderDto,
        @Req() req: Request,
    ) {
        const folder = await this.foldersService.getFolderById(id);
        const data = req['data'];

        if (
            folder.order.customer &&
            folder.order.customer.id !== data?.id
        )
            throw new ForbiddenException('Forbidden access');

        if (folder.order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.foldersService.updateFolder(folder, folderData);
        await this.foldersService.updateFolderPriceOrDelete(folder.id);
        await this.ordersService.updateOrderPriceOrDelete(folder.order.id);

        return {
            updated: true,
            id,
        }
    }

    @IsPublic()
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteFolder(@Param('id') id: string, @Req() req: Request) {
        const folder = await this.foldersService.getFolderById(id);
        const data = req['data'];

        if (
            folder.order.customer &&
            folder.order.customer.id !== data?.id
        )
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