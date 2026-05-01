import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { OrderDetail } from "@modules/orders/entities/orderDetail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateOrderDetailDto } from "@modules/orders/dtos/updateOrderDetail.dto";
import { Order } from "@modules/orders/entities/order.entity";

@Injectable()
export class OrderDetailsService {
    constructor(
        @InjectRepository(OrderDetail)
        private readonly orderDetailsRepository: Repository<OrderDetail>,
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
    ) {}

    async updateOrderDetail(orderDetailData: UpdateOrderDetailDto, order: Order) {
        if (order.detail) {
            await this.orderDetailsRepository.update(order.detail.id, {
                name: orderDetailData.name,
                email: orderDetailData.email,
                phone: orderDetailData.phone,
                lat: orderDetailData.lat,
                lng: orderDetailData.lng,
                postalCode: orderDetailData.postalCode,
            });
        } else {
            const orderDetail = this.orderDetailsRepository.create({
                name: orderDetailData.name,
                email: orderDetailData.email,
                phone: orderDetailData.phone,
                lat: orderDetailData.lat,
                lng: orderDetailData.lng,
                postalCode: orderDetailData.postalCode,
            });
            await this.orderDetailsRepository.save(orderDetail);

            order.detail = orderDetail;
            await this.ordersRepository.save(order);
        }
    }
}