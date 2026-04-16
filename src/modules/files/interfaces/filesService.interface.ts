import { IFileData } from "../../documents/interfaces/fileData.interface";

export interface IFilesService {
    saveFile(file: Express.Multer.File): Promise<IFileData>;
}

export const IFilesService = Symbol('IFilesService');