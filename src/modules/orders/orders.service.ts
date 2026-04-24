import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "@modules/orders/entities/order.entity";
import { Repository } from "typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";
import { Folder } from "@modules/folders/entities/folder.entity";
import { Document } from "@modules/documents/entities/document.entity";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(Folder)
        private readonly foldersRepository: Repository<Folder>,
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    async getOrders() {
        return this.ordersRepository.find();
    }

    async getOrderById(id: number) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: {
                customer: true,
                folders: {
                    documents: true,
                },
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

    async updateOrderStatus(order: Order, status: OrderStatus) {
        if (
            (order.status === OrderStatus.PENDING && status === OrderStatus.PAID)
        ) {
            await this.ordersRepository.update(order.id, {
                status,
            });

            return;
        }

        throw new BadRequestException('Cannot update order status');
    }
    
    async updateOrderPriceOrDelete(orderId: number) {
        const order = await this.ordersRepository.findOneOrFail({
            where: {
                id: orderId,
            },
            relations: {
                folders: true,
            },
        });

        if (!order.folders.length) {
            await this.ordersRepository.delete(order.id);

            return;
        }

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

    async deleteOrder(order: Order) {
        for await (const folder of order.folders) {
            await this.documentsRepository.delete({
                folder: {
                    id: folder.id,
                },
            });

            await this.foldersRepository.delete(folder.id);
        }

        await this.ordersRepository.delete(order.id);
    }
}