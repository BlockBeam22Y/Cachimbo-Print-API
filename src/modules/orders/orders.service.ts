import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "@modules/orders/entities/order.entity";
import { Repository } from "typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";

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
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: {
                customer: true,
            },
        });

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
    
    async updateOrderPrice(orderId: number) {
        const order = await this.ordersRepository.findOneOrFail({
            where: {
                id: orderId,
            },
            relations: {
                folders: true,
            },
        });

        const orderPrice = order.folders.reduce(
            (sum, folder) => {
                sum += folder.price;

                return sum;
            }, 0
        );

        await this.ordersRepository.update(order.id, {
            totalPrice: orderPrice,
        });
    }
}