import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { FilesModule } from "../files/files.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Document,
        ]),
        FilesModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}