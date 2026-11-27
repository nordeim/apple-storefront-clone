import { getProduct, type Product } from "./catalog";

export const MAX_LINE_QUANTITY = 10;

export interface CartLine {
  productId: string;
  /** option id -> choice id */
  selections: Record<string, string>;
  quantity: number;
}

export type CartAction =
  | { type: "add"; line: CartLine }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

export function lineKey(productId: string, selections: Record<string, string>): string {
  const parts = Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`);
  return `${productId}|${parts.join(",")}`;
}

export function defaultSelections(product: Product): Record<string, string> {
  const selections: Record<string, string> = {};
  for (const option of product.options) {
    const first = option.choices[0];
    if (first) selections[option.id] = first.id;
  }
  return selections;
}

export function unitPrice(product: Product, selections: Record<string, string>): number {
  let total = product.basePrice;
  for (const option of product.options) {
    const choice = option.choices.find((c) => c.id === selections[option.id]);
    if (choice) total += choice.deltaSgd;
  }
  return total;
}

export function describeSelections(product: Product, selections: Record<string, string>): string[] {
  const labels: string[] = [];
  for (const option of product.options) {
    const choice = option.choices.find((c) => c.id === selections[option.id]);
    if (choice) labels.push(choice.label);
  }
  return labels;
}

const clampQuantity = (quantity: number) => Math.min(MAX_LINE_QUANTITY, Math.max(0, quantity));

export function cartReducer(lines: readonly CartLine[], action: CartAction): readonly CartLine[] {
  switch (action.type) {
    case "add": {
      const { line } = action;
      if (!getProduct(line.productId) || !Number.isInteger(line.quantity) || line.quantity < 1) {
        // Same reference on a rejected action — useReducer bails out instead of re-rendering consumers.
        return lines;
      }
      const key = lineKey(line.productId, line.selections);
      const existing = lines.find((l) => lineKey(l.productId, l.selections) === key);
      if (!existing) return [...lines, { ...line, quantity: clampQuantity(line.quantity) }];
      return lines.map((l) =>
        l === existing ? { ...l, quantity: clampQuantity(l.quantity + line.quantity) } : l,
      );
    }
    case "setQuantity": {
      if (!Number.isInteger(action.quantity)) return lines;
      if (action.quantity <= 0) return lines.filter((l) => lineKey(l.productId, l.selections) !== action.key);
      return lines.map((l) =>
        lineKey(l.productId, l.selections) === action.key
          ? { ...l, quantity: clampQuantity(action.quantity) }
          : l,
      );
    }
    case "remove":
      return lines.filter((l) => lineKey(l.productId, l.selections) !== action.key);
    case "clear":
      return [];
  }
}

export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, l) => {
    const product = getProduct(l.productId);
    return product ? sum + unitPrice(product, l.selections) * l.quantity : sum;
  }, 0);
}
