import "dotenv/config";
import app from "./api/index.ts";
import { createServer as createViteServer } from "vite";
import path from "path";
import express from "express";

const PORT = Number(process.env.PORT) || 5174;

async function startDevServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EduOne 2047] Server running on http://localhost:${PORT}`);
  });
}

startDevServer();
