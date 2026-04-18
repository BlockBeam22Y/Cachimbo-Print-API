import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { FilesModule } from "../files/files.module";
import { FoldersModule } from "../folders/folders.module";
import { OrdersModule } from "../orders/orders.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Document,
        ]),
        FilesModule,
        FoldersModule,
        OrdersModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}