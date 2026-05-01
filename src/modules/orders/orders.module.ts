import { Module } from "@nestjs/common";
import { OrdersController } from "@modules/orders/orders.controller";
import { OrdersService } from "@modules/orders/services/orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "@modules/orders/entities/order.entity";
import { CustomersModule } from "@modules/customers/customers.module";
import { AuthModule } from "@modules/auth/auth.module";
import { Folder } from "@modules/folders/entities/folder.entity";
import { Document } from "@modules/documents/entities/document.entity";
import { FilesModule } from "@modules/files/files.module";
import { OrderDetail } from "@modules/orders/entities/orderDetail.entity";
import { OrderDetailsService } from "@modules/orders/services/orderDetails.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            OrderDetail,
            Folder,
            Document,
        ]),
        FilesModule,
        CustomersModule,
        AuthModule,
    ],
    controllers: [OrdersController],
    providers: [
        OrdersService,
        OrderDetailsService,
    ],
    exports: [OrdersService],
})
export class OrdersModule {}