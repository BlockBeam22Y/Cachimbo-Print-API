import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { Customer } from "../customers/entities/customer.entity";
import { OrderStatus } from "./interfaces/orderStatus.enum";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
    ) {}

    async getOrders() {
        return this.ordersRepository.find();
    }

    async getOrderById(id: number) {
        const order = await this.ordersRepository.findOneBy({ id });

        if (!order)
            throw new NotFoundException('Order not found');

        return order;
    }

    async createOrder(customer: Customer) {
        const order = this.ordersRepository.create({
            totalPrice: 0,
            status: OrderStatus.PENDING,
            customer,
        });

        return this.ordersRepository.save(order);
    }
}