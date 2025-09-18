import { t } from "elysia";
import { fileController } from "../controllers/file.controller";
import { prisma } from "../prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
export const fileRoutes = (app: any) =>
  app.group("/api/v1/files", (app: any) =>
    app

      .post(
  "/upload",
  async ({ body }) => {
    console.log("📥 Body diterima:", body);
    const { folderId, file } = body;

    if (!file) {
      return { message: "No file uploaded" };
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const newFile = await prisma.file.create({
      data: {
        name: file.name,
        type: file.type,
        folderId: Number(folderId),
        path: filePath,
      },
    });

    return newFile;
  },
  {
    body: t.Object({
      folderId: t.String(),
      file: t.File(),
    }),
  }
)



      .get("/folder/:folderId", fileController.getByFolderId, {
        params: t.Object({ folderId: t.Numeric() }),
      })


      .post("/", fileController.create, {
        body: t.Object({
          name: t.String(),
          type: t.String(),
          folderId: t.Numeric(),
        }),
      })


      .put("/:id", fileController.update, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({
          name: t.Optional(t.String()),
          type: t.Optional(t.String()),
        }),
      })


      .delete("/:id", fileController.remove, {
        params: t.Object({ id: t.Numeric() }),
      })
  );


