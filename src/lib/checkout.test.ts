import { describe, expect, it } from "vitest";
import { generateOrderNumber, validateCheckout, type CheckoutForm } from "./checkout";

const valid: CheckoutForm = {
  fullName: "Tan Wei Ming",
  email: "wei.ming@example.com",
  phone: "91234567",
  address: "1 Raffles Place, #20-01",
  postalCode: "048616",
};

describe("validateCheckout", () => {
  it("accepts a complete, well-formed form", () => {
    expect(validateCheckout(valid)).toEqual({});
  });

  it("flags every empty required field", () => {
    const errors = validateCheckout({ fullName: "", email: "", phone: "", address: "", postalCode: "" });
    expect(Object.keys(errors).sort()).toEqual(["address", "email", "fullName", "phone", "postalCode"]);
  });

  it("requires a 6-digit Singapore postal code", () => {
    expect(validateCheckout({ ...valid, postalCode: "12345" }).postalCode).toBeDefined();
    expect(validateCheckout({ ...valid, postalCode: "12345a" }).postalCode).toBeDefined();
    expect(validateCheckout({ ...valid, postalCode: "1234567" }).postalCode).toBeDefined();
  });

  it("requires an 8-digit Singapore number starting with 3, 6, 8 or 9 (optionally +65)", () => {
    expect(validateCheckout({ ...valid, phone: "+65 6123 4567" }).phone).toBeUndefined();
    expect(validateCheckout({ ...valid, phone: "11234567" }).phone).toBeDefined();
    expect(validateCheckout({ ...valid, phone: "9123456" }).phone).toBeDefined();
  });

  it("rejects malformed emails", () => {
    expect(validateCheckout({ ...valid, email: "not-an-email" }).email).toBeDefined();
    expect(validateCheckout({ ...valid, email: "a@b" }).email).toBeDefined();
  });

  it("treats whitespace-only values as empty", () => {
    expect(validateCheckout({ ...valid, fullName: "   " }).fullName).toBeDefined();
  });
});

describe("generateOrderNumber", () => {
  it("uses the EL- prefix and the safe charset the router accepts", () => {
    expect(generateOrderNumber()).toMatch(/^EL-[A-Z0-9]{8}$/);
  });

  it("produces distinct values across calls", () => {
    const set = new Set(Array.from({ length: 50 }, () => generateOrderNumber()));
    expect(set.size).toBe(50);
  });
});
