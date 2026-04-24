import { Module } from "@nestjs/common";
import { DocumentsController } from "@modules/documents/documents.controller";
import { DocumentsService } from "@modules/documents/documents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "@modules/documents/entities/document.entity";
import { FilesModule } from "@modules/files/files.module";
import { FoldersModule } from "@modules/folders/folders.module";
import { OrdersModule } from "@modules/orders/orders.module";
import { AuthModule } from "@modules/auth/auth.module";
import { CustomersModule } from "@modules/customers/customers.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Document,
        ]),
        FilesModule,
        FoldersModule,
        OrdersModule,
        CustomersModule,
        AuthModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}