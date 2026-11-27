// Generates public/sitemap.xml AND public/robots.txt from the tested
// src/lib/sitemap.ts seam (one VITE_SITE_URL stamps both files, so the
// robots Sitemap directive can never drift from the sitemap's origin).
// The seam is TypeScript with path-free relative imports, so load it through
// Vite (the repo's own toolchain) instead of shelling out to another runner.
// Usage: npm run sitemap  (VITE_SITE_URL overrides the base — from the shell,
// or from a .env file per .env.example; default is the dev origin — set it to
// the deployed origin when generating for production.)
import { createServer, loadEnv } from "vite";
import { mkdir, writeFile } from "node:fs/promises";

// Precedence: the shell environment wins over .env (the Vite convention), and
// a .env file in the repo root is honored for the documented `cp .env.example
// .env` flow — loadEnv is what Vite itself uses, applied BEFORE the server
// exists (process.env is not populated from .env by Vite's node-side APIs).
const envFromFile = loadEnv("production", process.cwd(), "");
const base = process.env.VITE_SITE_URL ?? envFromFile.VITE_SITE_URL ?? "http://localhost:5173/";
const vite = await createServer({
  logLevel: "error",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  const { buildSitemapXml, renderRobots } = await vite.ssrLoadModule("/src/lib/sitemap.ts");
  const xml = buildSitemapXml(base);
  const robots = renderRobots(base);
  await mkdir("public", { recursive: true });
  await writeFile("public/sitemap.xml", xml, "utf8");
  await writeFile("public/robots.txt", robots, "utf8");
  const urls = (xml.match(/<url>/g) ?? []).length;
  console.log(`sitemap.xml written: ${urls} routes, base ${base}`);
  console.log(`robots.txt written: Sitemap directive -> ${base.replace(/\/+$/, "")}/sitemap.xml`);
} finally {
  await vite.close();
}
