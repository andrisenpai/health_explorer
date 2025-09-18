import { fileRepository } from "../repositories/file.repository";

export const fileService = {
  getByFolderId: (folderId: number) => fileRepository.getByFolderId(folderId),
  create: (data: { name: string; type: string; folderId: number }) =>
    fileRepository.create(data),


  update: (id: number, data: { name?: string; type?: string }) =>
    fileRepository.update(id, data),


  remove: (id: number) => fileRepository.remove(id),
};
