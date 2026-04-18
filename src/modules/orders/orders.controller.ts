import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dtos/createOrder.dto";
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
    async createOrder(@Body() orderData: CreateOrderDto, @Req() req: Request) {
        const { customerId } = orderData;

        const customer = await this.customersService.getCustomerById(customerId);

        return this.ordersService.createOrder(customer);
    }
}