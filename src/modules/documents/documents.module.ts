import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { FilesModule } from "../files/files.module";
import { FoldersModule } from "../folders/folders.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Document,
        ]),
        FilesModule,
        FoldersModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}