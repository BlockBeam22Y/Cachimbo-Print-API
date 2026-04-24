import { ColorName } from "@modules/folders/interfaces/colorName.enum";

export class UpdateFolderDto {
    name?: string;

    copies?: number;

    colorName?: ColorName;
}