import { Module } from "@nestjs/common";
import { FoldersController } from "./folders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Folder } from "./entities/folder.entity";
import { FolderColor } from "./entities/folderColor.entity";
import { FoldersService } from "./services/folders.service";
import { FolderColorsService } from "./services/folderColors.service";
import { OrdersModule } from "../orders/orders.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Folder,
            FolderColor,
        ]),
        OrdersModule,
        AuthModule,
    ],
    controllers: [FoldersController],
    providers: [
        FoldersService,
        FolderColorsService,
    ],
    exports: [FoldersService],
})
export class FoldersModule {}