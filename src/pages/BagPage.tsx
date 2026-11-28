import { BagSummary } from "@/components/BagSummary";
import { ArtPanel } from "@/components/ProductCard";
import { PageShell, PageTitle } from "@/components/PageShell";
import { useBag } from "@/context/BagContext";
import { MAX_LINE_QUANTITY, describeSelections, lineKey, unitPrice } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";

export function BagPage() {
  const { lines, subtotal, dispatch } = useBag();

  if (lines.length === 0) {
    return (
      <PageShell narrow>
        <PageTitle sub="Free delivery and easy returns on every order.">Your Bag is empty.</PageTitle>
        <a href={routeHref.store()} className="button px-8 py-3">
          Continue shopping
        </a>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle sub="Free delivery on every order.">Review your Bag.</PageTitle>
      <div className="grid items-start gap-12 wide:grid-cols-[1fr_340px]">
        <ul className="m-0 grid list-none gap-8 p-0">
          {lines.map((line) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            const key = lineKey(line.productId, line.selections);
            const qtyId = `qty-${key}`;
            return (
              <li key={key} className="grid grid-cols-[110px_1fr] gap-5 border-b border-[#d2d2d7] pb-8 tablet:grid-cols-[160px_1fr]">
                <ArtPanel product={product} className="aspect-[10/8] rounded-2xl" />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="m-0 font-display text-xl font-semibold tracking-normal">
                        <a href={routeHref.product(product.id)} className="text-inherit no-underline hover:underline">
                          {product.name}
                        </a>
                      </h2>
                      <p className="m-0 text-sm text-[#6e6e73]">{describeSelections(product, line.selections).join(" · ")}</p>
                    </div>
                    <p className="m-0 text-[17px] font-semibold">{formatSgd(unitPrice(product, line.selections) * line.quantity)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label htmlFor={qtyId} className="flex items-center gap-2 text-sm">
                      Qty
                      <select
                        id={qtyId}
                        value={line.quantity}
                        onChange={(e) => dispatch({ type: "setQuantity", key, quantity: Number(e.target.value) })}
                        className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-1.5"
                      >
                        {Array.from({ length: MAX_LINE_QUANTITY }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm text-[#0066cc] hover:underline"
                      onClick={() => dispatch({ type: "remove", key })}
                      aria-label={`Remove ${product.name} from Bag`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside aria-label="Order summary" className="rounded-[20px] bg-[#f5f5f7] p-6 wide:sticky wide:top-[calc(var(--nav-h)+24px)]">
          <BagSummary subtotal={subtotal} />
          <a href={routeHref.checkout} className="button button-block mt-6 text-center no-underline">
            Check Out
          </a>
        </aside>
      </div>
    </PageShell>
  );
}
