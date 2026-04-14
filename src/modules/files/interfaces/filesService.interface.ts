export interface IFilesService {
    saveFile(file: Express.Multer.File): Promise<string>;
    generatePreview(file: Express.Multer.File): Promise<string>;
}

export const IFilesService = Symbol('IFilesService');