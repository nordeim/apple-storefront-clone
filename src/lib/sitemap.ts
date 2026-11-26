import { CATEGORIES, PRODUCTS } from "./catalog";
import { INFO_TITLES } from "./site-content";

export interface SiteRoute {
  /** Canonical path form (`/store/mac`); the href form is `#/store/mac`. */
  path: string;
  priority: number;
  changefreq: "daily" | "weekly" | "monthly";
}

/**
 * The full crawlable route set, derived from the live catalog and footer
 * destination map — never a hand-maintained list that drifts from the code.
 *
 * SEO caveat (PAD ADR-007): the app routes by hash fragment, so search
 * engines collapse every route onto the entry URL. The sitemap still
 * enumerates the real route set for tooling and future path-routing, and
 * documents the limitation instead of pretending parity.
 */
export function siteRoutes(): SiteRoute[] {
  const routes: SiteRoute[] = [
    { path: "/", priority: 1, changefreq: "weekly" },
    { path: "/store", priority: 0.9, changefreq: "weekly" },
    { path: "/bag", priority: 0.5, changefreq: "weekly" },
    { path: "/entertainment", priority: 0.6, changefreq: "weekly" },
    { path: "/support", priority: 0.6, changefreq: "monthly" },
  ];
  for (const c of CATEGORIES) routes.push({ path: `/store/${c.id}`, priority: 0.8, changefreq: "weekly" });
  for (const p of PRODUCTS) routes.push({ path: `/product/${p.id}`, priority: 0.7, changefreq: "weekly" });
  for (const slug of INFO_TITLES.keys()) routes.push({ path: `/info/${slug}`, priority: 0.3, changefreq: "monthly" });
  return routes.sort((a, b) => a.path.localeCompare(b.path));
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Absolute href of a route path under a base origin (trailing slash normalized). */
export function routeUrl(base: string, path: string): string {
  const trimmed = base.replace(/\/+$/, "");
  // Home is the bare entry URL (the address crawlers actually see); every
  // other route carries its hash fragment.
  return path === "/" ? `${trimmed}/` : `${trimmed}/#${path}`;
}

/** Renders the complete `sitemap.xml` document for the enumerated route set. */
export function buildSitemapXml(base: string): string {
  const urls = siteRoutes()
    .map((r) => {
      const loc = esc(routeUrl(base, r.path));
      return [`  <url>`, `    <loc>${loc}</loc>`, `    <priority>${r.priority.toFixed(1)}</priority>`, `    <changefreq>${r.changefreq}</changefreq>`, `  </url>`].join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
