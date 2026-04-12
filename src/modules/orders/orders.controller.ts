import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dtos/createOrder.dto";
import { CustomersService } from "../customers/customers.service";

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

    @Post()
    async createOrder(@Body() orderData: CreateOrderDto) {
        const { customerId } = orderData;

        const customer = await this.customersService.getCustomerById(customerId);

        return this.ordersService.createOrder(customer);
    }
}