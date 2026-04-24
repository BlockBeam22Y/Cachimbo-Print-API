import { Controller, Param, Post } from "@nestjs/common";
import { CheckoutService } from "@modules/checkout/checkout.service";
import { OrdersService } from "@modules/orders/orders.service";
import { OrderStatus } from "@modules/orders/interfaces/orderStatus.enum";

@Controller('checkout')
export class CheckoutController {
    constructor(
        // private readonly checkoutService: CheckoutService,
        private readonly ordersService: OrdersService,
    ) {}
    
    @Post('/authorize/:orderId')
    async authorizePayment(@Param('orderId') orderId: number) {
        const order = await this.ordersService.getOrderById(orderId);

        await this.ordersService.updateOrderStatus(order, OrderStatus.PAID);

        return {
            success: true,
            orderId,
        };
    }
}