import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "@modules/orders/services/orders.service";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { Request } from "express";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";
import { IsPublic } from "@modules/auth/decorators/isPublic.decorator";
import { UpdateOrderDetailDto } from "./dtos/updateOrderDetail.dto";
import { OrderDetailsService } from "./services/orderDetails.service";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly orderDetailsService: OrderDetailsService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
    ) {}

    @Get()
    async getOrders() {
        return this.ordersService.getOrders();
    }

    @IsPublic()
    @UseGuards(AuthGuard)
    @Put('/detail/:id')
    async updateOrderDetail(
        @Param('id') id: number,
        @Body() orderDetailData: UpdateOrderDetailDto,
        @Req() req: Request,
    ) {
        const order = await this.ordersService.getOrderById(id);
        const user = req['user'];
        
        if (
            order.customer &&
            order.customer.id !== user?.id
        )
            throw new ForbiddenException('Forbidden access');

        if (order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.orderDetailsService.updateOrderDetail(orderDetailData, order);

        return {
            updated: true,
            id,
        };
    }

    @IsPublic()
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteOrder(@Param('id') id: number, @Req() req: Request) {
        const order = await this.ordersService.getOrderById(id);
        const user = req['user'];

        if (
            order.customer &&
            order.customer.id !== user?.id
        )
            throw new ForbiddenException('Forbidden access');

        if (order.status !== OrderStatus.PENDING)
            throw new BadRequestException('Order is already being processed');

        await this.ordersService.deleteOrder(order);

        for await (const folder of order.folders) {
            for await (const document of folder.documents) {
                await this.filesService.deleteFile(document.id);
            }
        }

        return {
            deleted: true,
            id,
        };
    }
}