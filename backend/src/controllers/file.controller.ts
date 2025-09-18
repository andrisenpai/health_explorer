import { fileService } from "../services/file.service";

export const fileController = {
  getByFolderId: ({ params }: any) =>
    fileService.getByFolderId(Number(params.folderId)),
  create: ({ body }: any) => fileService.create(body),

  // NEW: Update
  update: ({ params, body }: any) =>
    fileService.update(Number(params.id), body),

  // NEW: Delete
  remove: ({ params }: any) => fileService.remove(Number(params.id)),
};
