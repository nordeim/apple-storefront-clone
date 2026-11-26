import { useEffect, useRef, useState } from "react";
import { useBag } from "@/context/BagContext";
import { useHash } from "@/hooks/useRoute";
import { ArtPanel } from "@/components/ProductCard";
import { PageShell } from "@/components/PageShell";
import { defaultSelections, describeSelections, unitPrice } from "@/lib/cart";
import { getCategory, type Product } from "@/lib/catalog";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";

function Configurator({ product }: { product: Product }) {
  const { dispatch } = useBag();
  const hash = useHash();
  const [selections, setSelections] = useState(() => defaultSelections(product));
  const [added, setAdded] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const price = unitPrice(product, selections);

  useEffect(() => {
    if (!hash.includes("?buy")) return;
    headingRef.current?.scrollIntoView({ block: "center" });
    headingRef.current?.focus({ preventScroll: true });
  }, [hash]);

  const select = (optionId: string, choiceId: string) => {
    setAdded(false);
    setSelections((s) => ({ ...s, [optionId]: choiceId }));
  };

  return (
    <section aria-labelledby="configure-heading" className="mt-10 rounded-[28px] bg-[#f5f5f7] p-6 tablet:p-8">
      <h2 id="configure-heading" ref={headingRef} tabIndex={-1} className="m-0 mb-6 font-display text-[28px] font-semibold tracking-normal focus:outline-none">
        Choose your {product.name}
      </h2>

      <div className="grid gap-6">
        {product.options.map((option) => (
          <fieldset key={option.id} className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-3 p-0 text-[17px] font-semibold">{option.label}</legend>
            <div className="flex flex-wrap gap-3">
              {option.choices.map((choice) => {
                const checked = selections[option.id] === choice.id;
                return (
                  <label
                    key={choice.id}
                    className={`relative flex min-w-[120px] cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 text-[15px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0071e3] ${
                      checked ? "border-[#0071e3] ring-1 ring-[#0071e3]" : "border-[#d2d2d7] hover:border-[#86868b]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={option.id}
                      value={choice.id}
                      checked={checked}
                      onChange={() => select(option.id, choice.id)}
                      className="sr-only"
                    />
                    {choice.hex ? (
                      <span aria-hidden="true" className="h-5 w-5 rounded-full border border-black/20" style={{ background: choice.hex }} />
                    ) : null}
                    <span className="flex flex-col">
                      <span className="font-semibold">{choice.label}</span>
                      {choice.deltaSgd > 0 ? <span className="text-xs text-[#6e6e73]">+{formatSgd(choice.deltaSgd)}</span> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#d2d2d7] pt-6">
        <div>
          <p className="m-0 font-display text-3xl font-semibold tracking-normal" aria-live="polite">
            {formatSgd(price)}
          </p>
          <p className="m-0 text-xs text-[#6e6e73]">Includes 9% GST</p>
        </div>
        <button
          type="button"
          className="button px-8 py-3"
          onClick={() => {
            dispatch({ type: "add", line: { productId: product.id, selections, quantity: 1 } });
            setAdded(true);
          }}
        >
          Add to Bag
        </button>
      </div>

      <div role="status" className="min-h-6">
        {added ? (
          <p className="mt-4 mb-0 text-[15px]">
            Added {product.name}
            {describeSelections(product, selections).length > 0 ? ` (${describeSelections(product, selections).join(", ")})` : ""} to your Bag.{" "}
            <a href={routeHref.bag} className="link-cta">
              Review Bag
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function ProductPage({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6e6e73]">
        <a href={routeHref.store()} className="text-inherit hover:underline">
          Store
        </a>
        {category ? (
          <>
            {" / "}
            <a href={routeHref.store(category.id)} className="text-inherit hover:underline">
              {category.label}
            </a>
          </>
        ) : null}
      </nav>

      <div className="grid items-start gap-10 wide:grid-cols-[1.15fr_1fr]">
        <ArtPanel product={product} className="aspect-[10/8]" />
        <div>
          <h1 className="m-0 font-display text-[40px] leading-[1.1] font-semibold tracking-normal tablet:text-5xl">{product.name}</h1>
          <p className="mt-3 mb-0 font-display text-2xl text-[#1d1d1f]">{product.tagline}</p>
          <p className="mt-4 mb-0 text-[17px] text-[#6e6e73]">From {formatSgd(product.basePrice)} (GST included)</p>
          <p className="mt-6 mb-0 text-[17px] leading-relaxed">{product.summary}</p>
          <ul className="mt-6 mb-0 grid list-none gap-2 p-0">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[15px]">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0071e3]" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Configurator key={product.id} product={product} />
    </PageShell>
  );
}
