import {prisma} from "../prisma";

export const folderRepository = {
  getAll: () => prisma.folder.findMany(),
  getRoot: () => prisma.folder.findMany({ where: { parentId: null } }),
  getByParent: (parentId: number) =>
    prisma.folder.findMany({ where: { parentId } }),
  create: (data: { name: string; parentId?: number }) =>
    prisma.folder.create({ data }),


  update: (id: number, data: { name?: string; parentId?: number }) =>
    prisma.folder.update({
      where: { id },
      data,
    }),


  remove: (id: number) => prisma.folder.delete({ where: { id } }),
};
