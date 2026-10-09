// Production server for Hostinger Node.js apps: serves dist/ and falls back to index.html
// so client-side routes (/todos, /login, ...) don't 404 on refresh.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const isFile = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  // normalize + prefix check blocks path traversal outside dist/
  const filePath = normalize(join(distDir, decodeURIComponent(pathname)));
  const servesFile = filePath.startsWith(distDir) && (await isFile(filePath));
  const target = servesFile ? filePath : join(distDir, "index.html");

  try {
    const body = await readFile(target);
    const isAsset = servesFile && pathname.startsWith("/assets/");
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(target)] || "application/octet-stream",
      // Hashed Vite assets can be cached forever; index.html must always be fresh
      "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("dist/ not found. Run `npm run build` first.");
  }
}).listen(port, () => {
  console.log(`Serving dist/ on port ${port}`);
});
