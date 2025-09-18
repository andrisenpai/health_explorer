import { folderRepository } from "../repositories/folder.repository";

export const folderService = {
  getAll: () => folderRepository.getAll(),
  getRoot: () => folderRepository.getRoot(),
  getByParent: (parentId: number) => folderRepository.getByParent(parentId),
  create: (data: { name: string; parentId?: number }) =>
    folderRepository.create(data),


  update: (id: number, data: { name?: string; parentId?: number }) =>
    folderRepository.update(id, data),


  remove: (id: number) => folderRepository.remove(id),
};
