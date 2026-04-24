import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const documentFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, valid: boolean) => void, 
) => {
    if (!file)
        return callback(new BadRequestException('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];

    if (fileExtension !== 'pdf')
        return callback(new BadRequestException('File type not supported'), false);

    if (file.size > 2 * 1024 * 1024 * 1024)
        return callback(new BadRequestException('File size exceeds 2GB'), false);

    callback(null, true);
};