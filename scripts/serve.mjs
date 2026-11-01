// Local verification server with real 404 responses; not a production web server.
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
const base = path.resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};
createServer((req, res) => {
  let route;
  try {
    route = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  let file = path.resolve(base, `.${route}`);
  if (file !== base && !file.startsWith(base + path.sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory())
    file = path.join(file, "index.html");
  const found = fs.existsSync(file) && fs.statSync(file).isFile();
  if (!found) file = path.join(base, "404.html");
  res.writeHead(found ? 200 : 404, {
    "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(file).pipe(res);
}).listen(4180, "0.0.0.0", () =>
  console.log("Review server listening on port 4180"),
);
