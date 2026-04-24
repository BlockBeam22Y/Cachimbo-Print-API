import { Module } from "@nestjs/common";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { CloudStorageService } from "@modules/files/services/cloudStorage.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: IFilesService,
            useClass: CloudStorageService,
        },
    ],
    exports: [IFilesService],
})
export class FilesModule {}