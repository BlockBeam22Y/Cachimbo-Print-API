import { ColorName } from "@modules/folders/interfaces/colorName.enum";

export class UploadDocumentDto {
    folderId?: string;

    name: string;

    copies: number;

    colorName: ColorName;

    orderId?: number;
}