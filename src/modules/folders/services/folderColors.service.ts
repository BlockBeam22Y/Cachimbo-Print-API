import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FolderColor } from "@modules/folders/entities/folderColor.entity";
import { Repository } from "typeorm";
import { ColorName } from "@modules/folders/interfaces/colorName.enum";

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

    async getColorByName(name: ColorName) {
        const color = await this.folderColorsRepository.findOneBy({ name });

        if (!color)
            throw new NotFoundException('Folder color not found');

        return color;
    }
}