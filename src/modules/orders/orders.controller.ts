import { BadRequestException, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "@modules/orders/orders.service";
import { CustomersService } from "@modules/customers/customers.service";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { Request } from "express";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
        private readonly customersService: CustomersService,
    ) {}

    @Get()
    async getOrders() {
        return this.ordersService.getOrders();
    }

    // @UseGuards(AuthGuard)
    // @Post()
    // async createOrder(@Req() req: Request) {
    //     const user = req['user'];

    //     const customer = await this.customersService.getCustomerById(user.id);
    //     return this.ordersService.createOrder(customer);
    // }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteOrder(@Param('id') id: number, @Req() req: Request) {
        const order = await this.ordersService.getOrderById(id);
        const user = req['user'];

        if (order.customer.id !== user.id)
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