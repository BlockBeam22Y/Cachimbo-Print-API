import { Order } from "@modules/orders/entities/order.entity";
import { FolderColor } from "@modules/folders/entities/folderColor.entity";

export class IFolderData {
    name: string;
    copies: number;
    color: FolderColor;
    order: Order;
}