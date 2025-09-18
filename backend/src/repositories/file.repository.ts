import {prisma} from "../prisma";

export const fileRepository = {
  getByFolderId: (folderId: number) =>
    prisma.file.findMany({ where: { folderId } }),
  create: (data: { name: string; type: string; folderId: number }) =>
    prisma.file.create({ data }),

  // NEW: Update
  update: (id: number, data: { name?: string; type?: string }) =>
    prisma.file.update({ where: { id }, data }),

  // NEW: Delete
  remove: (id: number) => prisma.file.delete({ where: { id } }),
};
