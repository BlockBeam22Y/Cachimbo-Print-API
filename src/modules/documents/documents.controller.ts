import { Controller, Get, Inject, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IFilesService } from "../files/interfaces/filesService.interface";
import { diskStorage } from 'Multer';
import { fileNamer } from "../files/helpers/fileNamer.helper";
import { documentFileFilter } from "./helpers/documentFileFilter.helper";

@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        @Inject(IFilesService)
        private readonly filesService: IFilesService,
    ) {}

    @Get()
    async getDocuments() {
        return this.documentsService.getDocuments();
    }

    @Post('/upload')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            fileFilter: documentFileFilter,
            storage: diskStorage({
                filename: fileNamer,
                destination: './.tmp/documents',
            }),
        }),
    )
    async uploadDocuments(
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        const filesData = await Promise.all(
            files.map(async (file) => {
                const fileUrl = await this.filesService.saveFile(file);
                const previewUrl = await this.filesService.generatePreview(file);

                return {
                    file,
                    fileUrl,
                    previewUrl,
                };
            }),
        );

        return this.documentsService.uploadDocuments(filesData);
    }
}