import { formatSgd, gstIncluded } from "@/lib/money";

/** The shared Subtotal/Delivery/GST/Total ledger for the bag page and the checkout aside. */
export function BagSummary({ subtotal }: { subtotal: number }) {
  return (
    <dl className="m-0 grid gap-2 text-[15px]">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd className="m-0">{formatSgd(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Delivery</dt>
        <dd className="m-0">FREE</dd>
      </div>
      <div className="flex justify-between text-[#6e6e73]">
        <dt>Includes GST (9%)</dt>
        <dd className="m-0">{formatSgd(gstIncluded(subtotal))}</dd>
      </div>
      <div className="mt-2 flex justify-between border-t border-[#d2d2d7] pt-4 font-display text-2xl font-semibold tracking-normal">
        <dt>Total</dt>
        <dd className="m-0">{formatSgd(subtotal)}</dd>
      </div>
    </dl>
  );
}
