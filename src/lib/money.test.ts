import { describe, expect, it } from "vitest";
import { formatSgd, gstIncluded } from "./money";

describe("formatSgd", () => {
  it("formats whole dollars with thousands separators and no decimals", () => {
    expect(formatSgd(1299)).toBe("S$1,299");
    expect(formatSgd(0)).toBe("S$0");
  });

  it("keeps two decimals when cents are present", () => {
    expect(formatSgd(65.5)).toBe("S$65.50");
  });

  it("rejects non-finite or negative amounts instead of rendering NaN", () => {
    expect(() => formatSgd(Number.NaN)).toThrow(RangeError);
    expect(() => formatSgd(-1)).toThrow(RangeError);
  });
});

describe("gstIncluded", () => {
  it("extracts the 9% GST portion from a GST-inclusive total", () => {
    expect(gstIncluded(109)).toBe(9);
    expect(gstIncluded(1299)).toBe(107.26); // 11691 / 109 = 107.2569…
  });

  it("is zero for an empty bag", () => {
    expect(gstIncluded(0)).toBe(0);
  });
});
