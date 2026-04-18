import { IFileData } from "../../documents/interfaces/fileData.interface";

export interface IFilesService {
    saveFile(file: Express.Multer.File): Promise<IFileData>;
    deleteFile(file: Express.Multer.File): Promise<void>;
}

export const IFilesService = Symbol('IFilesService');