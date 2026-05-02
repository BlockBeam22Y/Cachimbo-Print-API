import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Put, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "@modules/orders/services/orders.service";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { Request } from "express";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";
import { IsPublic } from "@modules/auth/decorators/isPublic.decorator";
import { UpdateOrderDetailDto } from "@modules/orders/dtos/updateOrderDetail.dto";
import { OrderDetailsService } from "@modules/orders/services/orderDetails.service";
import { CustomersService } from "@modules/customers/services/customers.service";
import { CustomerGuard } from "@modules/auth/guards/customer.guard";
import { UserGuard } from "@modules/auth/guards/user.guard";
import { SetPermissions } from "@modules/auth/decorators/setPermissions.decorator";
import { PermissionFlagsBits } from "@modules/auth/helpers/permissionFlagsBits.helper";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly orderDetailsService: OrderDetailsService,
        private readonly customersService: CustomersService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
    ) {}

    @SetPermissions(PermissionFlagsBits.ViewOrders)
    @UseGuards(AuthGuard, UserGuard)
    @Get()
    async getOrders() {
        return this.ordersService.getOrders();
    }

    @SetPermissions(PermissionFlagsBits.ViewOrders)
    @Get('/:id')
    async getOrderById(@Param('id') id: number) {
        return this.ordersService.getOrderById(id);
    }

    @IsPublic()
    @UseGuards(AuthGuard)
    @Put('/:id/detail')
    async updateOrderDetail(
        @Param('id') id: number,
        @Body() orderDetailData: UpdateOrderDetailDto,
        @Req() req: Request,
    ) {
        const order = await this.ordersService.getOrderById(id);
        const data = req['data'];
        
        if (
            order.customer &&
            order.customer.id !== data?.id
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
    
    @UseGuards(AuthGuard, CustomerGuard)
    @Put('/:id/customer')
    async linkCustomerToOrder(@Param('id') id: number, @Req() req: Request) {
        const order = await this.ordersService.getOrderById(id);
        const data = req['data'];

        if (order.customer)
            throw new BadRequestException('Order already belongs to customer');

        if (order.status === OrderStatus.PENDING)
            throw new BadRequestException('Order checkout must be completed');

        if (order.detail?.email !== data.email)
            throw new BadRequestException('Emails do not match');

        await this.ordersService.updateOrderCustomer(order, data.customer);
        
        return {
            updated: true,
            orderId: order.id,
            customerId: data.customer.id,
        };
    }

    @IsPublic()
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteOrder(@Param('id') id: number, @Req() req: Request) {
        const order = await this.ordersService.getOrderById(id);
        const data = req['data'];

        if (
            order.customer &&
            order.customer.id !== data?.id
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