import { IFileData } from "@modules/documents/interfaces/fileData.interface";

export interface IFilesService {
    saveFile(file: Express.Multer.File): Promise<IFileData>;
    deleteFile(fileId: string): Promise<void>;
}

export const IFilesService = Symbol('IFilesService');