import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from "@nestjs/common";
import { FoldersService } from "./services/folders.service";
import { OrdersService } from "../orders/orders.service";
import { CreateFolderDto } from "./dtos/createFolder.dto";
import { FolderColorsService } from "./services/folderColors.service";
import { Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";

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