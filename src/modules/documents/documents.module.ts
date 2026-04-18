import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { FilesModule } from "../files/files.module";
import { FoldersModule } from "../folders/folders.module";
import { OrdersModule } from "../orders/orders.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Document,
        ]),
        FilesModule,
        FoldersModule,
        OrdersModule,
        AuthModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}