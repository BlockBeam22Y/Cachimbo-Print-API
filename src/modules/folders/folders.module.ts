import { Module } from "@nestjs/common";
import { FoldersController } from "@modules/folders/folders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Folder } from "@modules/folders/entities/folder.entity";
import { FolderColor } from "@modules/folders/entities/folderColor.entity";
import { FoldersService } from "@modules/folders/services/folders.service";
import { FolderColorsService } from "@modules/folders/services/folderColors.service";
import { OrdersModule } from "@modules/orders/orders.module";
import { AuthModule } from "@modules/auth/auth.module";
import { FilesModule } from "@modules/files/files.module";
import { Document } from "@modules/documents/entities/document.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Folder,
            FolderColor,
            Document,
        ]),
        FilesModule,
        OrdersModule,
        AuthModule,
    ],
    controllers: [FoldersController],
    providers: [
        FoldersService,
        FolderColorsService,
    ],
    exports: [
        FoldersService,
        FolderColorsService,
    ],
})
export class FoldersModule {}