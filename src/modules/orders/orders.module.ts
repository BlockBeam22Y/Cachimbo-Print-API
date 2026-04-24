import { Module } from "@nestjs/common";
import { OrdersController } from "@modules/orders/orders.controller";
import { OrdersService } from "@modules/orders/orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "@modules/orders/entities/order.entity";
import { CustomersModule } from "@modules/customers/customers.module";
import { AuthModule } from "@modules/auth/auth.module";
import { Folder } from "@modules/folders/entities/folder.entity";
import { Document } from "@modules/documents/entities/document.entity";
import { FilesModule } from "@modules/files/files.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            Folder,
            Document,
        ]),
        FilesModule,
        CustomersModule,
        AuthModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}