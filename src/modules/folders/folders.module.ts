import { Module } from "@nestjs/common";
import { FoldersController } from "./folders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Folder } from "./entities/folder.entity";
import { FolderColor } from "./entities/folderColor.entity";
import { FoldersService } from "./services/folders.service";
import { FolderColorsService } from "./services/folderColors.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Folder,
            FolderColor,
        ]),
    ],
    controllers: [FoldersController],
    providers: [
        FoldersService,
        FolderColorsService,
    ],
})
export class FoldersModule {}