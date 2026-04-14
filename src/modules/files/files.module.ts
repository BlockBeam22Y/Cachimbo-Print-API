import { Module } from "@nestjs/common";
import { IFilesService } from "./interfaces/filesService.interface";
import { LocalStorageService } from "./services/localStorage.service";

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