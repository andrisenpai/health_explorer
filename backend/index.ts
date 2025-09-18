import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { folderRoutes } from "./src/routes/folder.route";
import { fileRoutes } from "./src/routes/file.route";

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // tambahin domain deploy kalau nanti ke production
      methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/", () => ({
    status: "ok",
    message: "Hello from Elysia!",
    uptime: process.uptime(),
  }))
  .use(folderRoutes)
  .use(fileRoutes);
app.listen(3000);

console.log("🚀 Backend running at http://localhost:3000");
