import { describe, expect, it } from "vitest";
import {
  MAX_LINE_QUANTITY,
  bagLineSummary,
  cartCount,
  cartReducer,
  cartSubtotal,
  lineKey,
  unitPrice,
  type CartLine,
} from "./cart";
import { getProduct } from "./catalog";

const phone = getProduct("iphone-18-pro");
if (!phone) throw new Error("fixture product missing from catalog");

const base: CartLine = { productId: phone.id, selections: { storage: "256" }, quantity: 1 };

describe("lineKey", () => {
  it("is stable regardless of selection insertion order", () => {
    const a = lineKey("p", { color: "black", storage: "256" });
    const b = lineKey("p", { storage: "256", color: "black" });
    expect(a).toBe(b);
  });
});

describe("unitPrice", () => {
  it("adds option deltas to the base price", () => {
    const base256 = unitPrice(phone, { storage: "256" });
    const base512 = unitPrice(phone, { storage: "512" });
    expect(base512).toBeGreaterThan(base256);
    expect(base256).toBe(phone.basePrice);
  });

  it("ignores unknown option choices rather than producing NaN", () => {
    expect(unitPrice(phone, { storage: "bogus" })).toBe(phone.basePrice);
  });
});

describe("cartReducer", () => {
  it("adds a new line", () => {
    const next = cartReducer([], { type: "add", line: base });
    expect(next).toHaveLength(1);
    expect(cartCount(next)).toBe(1);
  });

  it("merges identical configurations by incrementing quantity", () => {
    const once = cartReducer([], { type: "add", line: base });
    const twice = cartReducer(once, { type: "add", line: base });
    expect(twice).toHaveLength(1);
    expect(twice[0]?.quantity).toBe(2);
  });

  it("keeps different configurations on separate lines", () => {
    const a = cartReducer([], { type: "add", line: base });
    const b = cartReducer(a, { type: "add", line: { ...base, selections: { storage: "512" } } });
    expect(b).toHaveLength(2);
  });

  it("clamps quantity to the maximum per line", () => {
    const full = cartReducer([], { type: "add", line: { ...base, quantity: MAX_LINE_QUANTITY } });
    const over = cartReducer(full, { type: "add", line: base });
    expect(over[0]?.quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("removes a line when quantity is set to zero or below", () => {
    const one = cartReducer([], { type: "add", line: base });
    const key = lineKey(base.productId, base.selections);
    expect(cartReducer(one, { type: "setQuantity", key, quantity: 0 })).toEqual([]);
  });

  it("ignores non-integer quantities", () => {
    const one = cartReducer([], { type: "add", line: base });
    const key = lineKey(base.productId, base.selections);
    expect(cartReducer(one, { type: "setQuantity", key, quantity: 1.5 })).toEqual(one);
  });

  it("drops lines for products that are not in the catalog", () => {
    const bad = cartReducer([], { type: "add", line: { productId: "ghost", selections: {}, quantity: 1 } });
    expect(bad).toEqual([]);
  });

  it("clears the bag", () => {
    const one = cartReducer([], { type: "add", line: base });
    expect(cartReducer(one, { type: "clear" })).toEqual([]);
  });
});

describe("bagLineSummary", () => {
  it("renders an option-less product as quantity only, with no leading separator", () => {
    const airtag = getProduct("airtag-4-pack");
    if (!airtag) throw new Error("fixture product missing from catalog");
    expect(bagLineSummary(airtag, { productId: airtag.id, selections: {}, quantity: 1 })).toBe("Qty 1");
  });

  it("joins the configuration labels and the quantity with single separators", () => {
    expect(
      bagLineSummary(phone, { productId: phone.id, selections: { color: "black", storage: "256" }, quantity: 1 }),
    ).toBe("Black · 256GB · Qty 1");
  });

  it("reflects quantities above one", () => {
    expect(
      bagLineSummary(phone, { productId: phone.id, selections: { color: "black", storage: "512" }, quantity: 3 }),
    ).toBe("Black · 512GB · Qty 3");
  });
});

describe("cartSubtotal", () => {
  it("multiplies unit price by quantity across lines", () => {
    const lines = cartReducer([], { type: "add", line: { ...base, quantity: 2 } });
    expect(cartSubtotal(lines)).toBe(phone.basePrice * 2);
  });

  it("is zero for an empty bag", () => {
    expect(cartSubtotal([])).toBe(0);
  });
});
