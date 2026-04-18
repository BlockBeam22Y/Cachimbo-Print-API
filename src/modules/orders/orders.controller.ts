import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CustomersService } from "../customers/customers.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Request } from "express";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly customersService: CustomersService,
    ) {}

    @Get()
    async getOrders() {
        return this.ordersService.getOrders();
    }

    @UseGuards(AuthGuard)
    @Post()
    async createOrder(@Req() req: Request) {
        const user = req['user'];

        const customer = await this.customersService.getCustomerById(user.id);
        return this.ordersService.createOrder(customer);
    }
}