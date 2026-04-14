import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FolderColor } from "../entities/folderColor.entity";
import { Repository } from "typeorm";
import { ColorName } from "../interfaces/colorName.enum";

@Injectable()
export class FolderColorsService implements OnModuleInit {
    constructor(
        @InjectRepository(FolderColor)
        private readonly folderColorsRepository: Repository<FolderColor>,
    ) {}

    async onModuleInit() {
        if (await this.folderColorsRepository.count())
            return;

        await this.folderColorsRepository.insert([
            {
                name: ColorName.MONO,
                unitPrice: 10,
            },
            {
                name: ColorName.COLOR,
                unitPrice: 30,
            },
        ]);
    }
}