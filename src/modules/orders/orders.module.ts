import { Module } from "@nestjs/common";
import { OrdersController } from "@modules/orders/orders.controller";
import { OrdersService } from "@modules/orders/orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "@modules/orders/entities/order.entity";
import { CustomersModule } from "@modules/customers/customers.module";
import { AuthModule } from "@modules/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
        ]),
        CustomersModule,
        AuthModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}