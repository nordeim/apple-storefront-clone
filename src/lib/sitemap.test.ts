import { describe, expect, it } from "vitest";
import { CATEGORIES, PRODUCTS } from "./catalog";
import { INFO_TITLES } from "./site-content";
import { buildSitemapXml, renderRobots, siteRoutes } from "./sitemap";

describe("siteRoutes", () => {
  it("enumerates the real route set: home, store, categories, products, bag, entertainment, support, info pages", () => {
    const routes = siteRoutes();
    const paths = routes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/store");
    for (const c of CATEGORIES) expect(paths).toContain(`/store/${c.id}`);
    for (const p of PRODUCTS) expect(paths).toContain(`/product/${p.id}`);
    expect(paths).toContain("/bag");
    expect(paths).toContain("/entertainment");
    expect(paths).toContain("/support");
    for (const slug of INFO_TITLES.keys()) expect(paths).toContain(`/info/${slug}`);
  });

  it("is unique and sorted deterministically", () => {
    const paths = siteRoutes().map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    const sorted = [...paths].sort();
    expect(paths).toEqual(sorted);
  });

  it("routes carry a priority in (0, 1] and a changefreq", () => {
    for (const r of siteRoutes()) {
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
      expect(["daily", "weekly", "monthly"]).toContain(r.changefreq);
    }
  });
});

describe("buildSitemapXml", () => {
  it("emits a valid urlset document with absolute URLs joined to the base", () => {
    const xml = buildSitemapXml("https://clone.example");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain("<loc>https://clone.example/</loc>");
    expect(xml).toContain("<loc>https://clone.example/#/store/mac</loc>");
    expect(xml).toContain("<loc>https://clone.example/#/product/iphone-18-pro</loc>");
    expect((xml.match(/<url>/g) ?? []).length).toBe(siteRoutes().length);
    expect(xml.endsWith("</urlset>\n")).toBe(true);
  });

  it("escapes XML-significant characters in the base URL", () => {
    const xml = buildSitemapXml('https://x.example/?a=1&b="w"');
    expect(xml).toContain("&amp;");
    expect(xml).not.toContain("&b=");
    expect(xml).toContain("&quot;w&quot;");
  });

  it("normalizes a trailing slash on the base", () => {
    expect(buildSitemapXml("https://x.example/")).toBe(buildSitemapXml("https://x.example"));
  });
});

describe("renderRobots", () => {
  it("stamps the Sitemap directive with the base origin joined to sitemap.xml", () => {
    const txt = renderRobots("https://clone.example");
    expect(txt).toContain("User-agent: *");
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Sitemap: https://clone.example/sitemap.xml");
  });

  it("normalizes a trailing slash on the base like the sitemap renderer", () => {
    expect(renderRobots("https://clone.example/")).toContain("Sitemap: https://clone.example/sitemap.xml");
  });

  it("documents the hash-routing caveat to crawlers (the honest SEO posture)", () => {
    const txt = renderRobots("https://clone.example");
    expect(txt.toLowerCase()).toContain("hash");
  });
});
