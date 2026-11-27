import { describeSelections, lineKey, unitPrice } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { formatSgd } from "@/lib/money";
import type { CartLine } from "@/lib/cart";

/** One bag line in a compact summary list: name, configuration, quantity and
 * the line total. Shared by the nav's bag popover and the checkout aside. */
export function BagLineRow({ line }: { line: CartLine }) {
  const product = getProduct(line.productId);
  if (!product) return null;
  return (
    <li className="flex justify-between gap-3 text-sm">
      <span>
        <span className="block font-semibold">{product.name}</span>
        <span className="block text-xs text-[#6e6e73]">
          {describeSelections(product, line.selections).join(" · ")} · Qty {line.quantity}
        </span>
      </span>
      <span className="whitespace-nowrap">{formatSgd(unitPrice(product, line.selections) * line.quantity)}</span>
    </li>
  );
}

/** The list wrapper that renders every bag line as a compact row. */
export function BagLineList({ lines, className }: { lines: readonly CartLine[]; className?: string }) {
  return (
    <ul className={className ? `m-0 grid list-none gap-3 p-0 ${className}` : "m-0 grid list-none gap-3 p-0"}>
      {lines.map((line) => (
        <BagLineRow key={lineKey(line.productId, line.selections)} line={line} />
      ))}
    </ul>
  );
}
