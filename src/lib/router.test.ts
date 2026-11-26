import { describe, expect, it } from "vitest";
import { parseHash } from "./router";

describe("parseHash", () => {
  it("treats empty and root hashes as home", () => {
    expect(parseHash("")).toEqual({ name: "home" });
    expect(parseHash("#")).toEqual({ name: "home" });
    expect(parseHash("#/")).toEqual({ name: "home" });
  });

  it("parses store with and without a valid category", () => {
    expect(parseHash("#/store")).toEqual({ name: "store" });
    expect(parseHash("#/store/mac")).toEqual({ name: "store", category: "mac" });
  });

  it("falls back to not-found for an unknown category", () => {
    expect(parseHash("#/store/toasters")).toEqual({ name: "not-found" });
  });

  it("parses product ids only when they exist in the catalog", () => {
    expect(parseHash("#/product/iphone-18-pro")).toEqual({ name: "product", id: "iphone-18-pro" });
    expect(parseHash("#/product/does-not-exist")).toEqual({ name: "not-found" });
  });

  it("decodes the search query and tolerates malformed escapes", () => {
    expect(parseHash("#/search?q=mac%20book")).toEqual({ name: "search", query: "mac book" });
    expect(parseHash("#/search?q=%E0%A4%A")).toEqual({ name: "search", query: "%E0%A4%A" });
    expect(parseHash("#/search")).toEqual({ name: "search", query: "" });
  });

  it("restricts confirmation order numbers to a safe charset", () => {
    expect(parseHash("#/confirmation/EL-8F3K2Q9X")).toEqual({ name: "confirmation", orderNo: "EL-8F3K2Q9X" });
    expect(parseHash("#/confirmation/<script>")).toEqual({ name: "not-found" });
  });

  it("handles static pages and info slugs", () => {
    expect(parseHash("#/bag")).toEqual({ name: "bag" });
    expect(parseHash("#/checkout")).toEqual({ name: "checkout" });
    expect(parseHash("#/entertainment")).toEqual({ name: "entertainment" });
    expect(parseHash("#/support")).toEqual({ name: "support" });
    expect(parseHash("#/info/privacy")).toEqual({ name: "info", slug: "privacy" });
    expect(parseHash("#/info/..%2F..")).toEqual({ name: "not-found" });
  });

  it("returns not-found for unknown routes", () => {
    expect(parseHash("#/nope")).toEqual({ name: "not-found" });
  });
});
