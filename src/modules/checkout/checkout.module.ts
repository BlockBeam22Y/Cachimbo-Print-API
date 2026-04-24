import { OrdersModule } from "@modules/orders/orders.module";
import { Module } from "@nestjs/common";
import { CheckoutController } from "@modules/checkout/checkout.controller";
import { CheckoutService } from "@modules/checkout/checkout.service";

@Module({
    imports: [
        OrdersModule,
    ],
    controllers: [CheckoutController],
    providers: [CheckoutService],
})
export class CheckoutModule {}