import { Controller, Get } from "@nestjs/common";
import { FoldersService } from "./services/folders.service";

@Controller('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
    ) {}

    @Get()
    async getFolders() {
        return this.foldersService.getFolders();
    }
}