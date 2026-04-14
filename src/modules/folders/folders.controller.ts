import { Body, Controller, Get, Post } from "@nestjs/common";
import { FoldersService } from "./services/folders.service";
import { OrdersService } from "../orders/orders.service";
import { CreateFolderDto } from "./dtos/createFolder.dto";
import { FolderColorsService } from "./services/folderColors.service";

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

    @Post()
    async createFolder(@Body() folderData: CreateFolderDto) {
        const { colorName, orderId } = folderData;
        
        const color = await this.folderColorsService.getColorByName(colorName);
        const order = await this.ordersService.getOrderById(orderId);

        return this.foldersService.createFolder(folderData, color, order)
    }
}