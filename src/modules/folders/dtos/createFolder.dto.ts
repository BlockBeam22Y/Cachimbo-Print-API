import { ColorName } from "../interfaces/colorName.enum";

export class CreateFolderDto {
    name: string;

    copies: number;

    colorName: ColorName;

    orderId: number;
}