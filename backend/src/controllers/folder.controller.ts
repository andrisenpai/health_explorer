import { folderService } from "../services/folder.service";
import {prisma} from "../prisma"
export const folderController = {
  getAll: () => folderService.getAll(),
  getRoot: () => folderService.getRoot(),
  getByParent: ({ params }: any) =>
    folderService.getByParent(Number(params.id)),
  create: ({ body }: any) => folderService.create(body),

  // NEW: Update
  update: ({ params, body }: any) =>
    folderService.update(Number(params.id), body),

  // NEW: Delete
  async remove({ params, set }: any) {
    const { id } = params;

    // cek apakah folder ada
    const folder = await prisma.folder.findUnique({
      where: { id: Number(id) },
      include: { children: true, files: true },
    });

    if (!folder) {
      set.status = 404;
      return { error: "Folder not found" };
    }

    if (folder.children.length > 0 || folder.files.length > 0) {
      set.status = 400;
      return { error: "Folder is not empty" };
    }

    await prisma.folder.delete({ where: { id: Number(id) } });
    return { message: "Folder deleted successfully" };
  },
};
