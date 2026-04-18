import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from "@nestjs/common";
import { FoldersService } from "@modules/folders/services/folders.service";
import { OrdersService } from "@modules/orders/orders.service";
import { CreateFolderDto } from "@modules/folders/dtos/createFolder.dto";
import { FolderColorsService } from "@modules/folders/services/folderColors.service";
import { Request } from "express";
import { AuthGuard } from "@modules/auth/guards/auth.guard";

@Controller('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
        private readonly folderColorsService: FolderColorsService,
        private readonly ordersService: OrdersService,
    ) {}

    @Get()
    async getFolders() {
        return this.foldersService.getFolders();
    }

    @UseGuards(AuthGuard)
    @Post()
    async createFolder(
        @Body() folderData: CreateFolderDto,
        @Req() req: Request,
    ) {
        const { colorName, orderId } = folderData;
        const user = req['user'];

        const order = await this.ordersService.getOrderById(orderId);
        if (order.customer.id !== user.id)
            throw new ForbiddenException('Forbidden access');
        
        const color = await this.folderColorsService.getColorByName(colorName);
        return this.foldersService.createFolder(folderData, color, order)
    }
}