export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

export type CheckoutField = keyof CheckoutForm;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SG_POSTAL_CODE = /^\d{6}$/;
const SG_PHONE = /^[3689]\d{7}$/;

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const fullName = form.fullName.trim();
  const email = form.email.trim();
  const address = form.address.trim();
  const postalCode = form.postalCode.trim();
  // Strip only an explicit country code: a leading "+65", or a bare "65"
  // followed by exactly 8 digits. A legal 8-digit number that merely starts
  // with 65 (e.g. 65123456) must survive normalization untouched.
  const phone = form.phone
    .replace(/[\s-]/g, "")
    .replace(/^\+65/, "")
    .replace(/^65(?=\d{8}$)/, "");

  if (!fullName) errors.fullName = "Enter your full name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL.test(email)) errors.email = "Enter a valid email address, such as name@example.com.";
  if (!form.phone.trim()) errors.phone = "Enter your mobile number.";
  else if (!SG_PHONE.test(phone)) errors.phone = "Enter an 8-digit Singapore number starting with 3, 6, 8 or 9.";
  if (!address) errors.address = "Enter your delivery address.";
  if (!postalCode) errors.postalCode = "Enter your postal code.";
  else if (!SG_POSTAL_CODE.test(postalCode)) errors.postalCode = "Postal codes in Singapore have 6 digits.";
  return errors;
}

// 32 symbols divides 256 evenly, so masking a random byte introduces no modulo bias.
const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderNumber(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => ORDER_ALPHABET.charAt(b % ORDER_ALPHABET.length)).join("");
  return `EL-${body}`;
}
