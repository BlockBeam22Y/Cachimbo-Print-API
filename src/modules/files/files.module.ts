import { Module } from "@nestjs/common";
import { IFilesService } from "@modules/files/interfaces/filesService.interface";
import { LocalStorageService } from "@modules/files/services/localStorage.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: IFilesService,
            useClass: LocalStorageService,
        },
    ],
    exports: [IFilesService],
})
export class FilesModule {}