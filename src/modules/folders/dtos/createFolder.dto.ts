import { ColorName } from "@modules/folders/interfaces/colorName.enum";

export class CreateFolderDto {
    name: string;

    copies: number;

    colorName: ColorName;

    orderId: number;
}