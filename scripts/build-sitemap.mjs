// Generates public/sitemap.xml from the tested src/lib/sitemap.ts seam.
// The seam is TypeScript with path-free relative imports, so load it through
// Vite (the repo's own toolchain) instead of shelling out to another runner.
// Usage: npm run sitemap  (VITE_SITE_URL overrides the base; default is the
// dev origin — set it to the deployed origin when generating for production.)
import { createServer } from "vite";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.VITE_SITE_URL ?? "http://localhost:5173/";
const vite = await createServer({
  logLevel: "error",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  const { buildSitemapXml } = await vite.ssrLoadModule("/src/lib/sitemap.ts");
  const xml = buildSitemapXml(base);
  await mkdir("public", { recursive: true });
  await writeFile("public/sitemap.xml", xml, "utf8");
  const urls = (xml.match(/<url>/g) ?? []).length;
  console.log(`sitemap.xml written: ${urls} routes, base ${base}`);
} finally {
  await vite.close();
}
