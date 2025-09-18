import { t } from "elysia";
import { folderController } from "../controllers/folder.controller";

export const folderRoutes = (app: any) =>
  app.group("/api/v1", (app: any) =>
    app
      .get("/root", folderController.getRoot)
      .get("/folders", folderController.getAll)
      .get("/folders/:id", folderController.getByParent, {
        params: t.Object({ id: t.Numeric() }),
      })
      .post("/folders", folderController.create, {
        body: t.Object({
          name: t.String(),
          parentId: t.Optional(t.Numeric()),
        }),
      })

      .put("/folders/:id", folderController.update, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({
          name: t.Optional(t.String()),
          parentId: t.Optional(t.Numeric()),
        }),
      })

      .delete("/folders/:id", folderController.remove, {
        params: t.Object({
          id: t.Numeric(),
        }),
      })

  );
