import { useMemo, useState } from "react";
import { PageShell, PageTitle } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { StoreQuickLinks, StoreRails } from "@/components/StoreRails";
import { PRODUCTS, getCategory, productsByCategory, type CategoryId, type Product } from "@/lib/catalog";
import { STORE_CATEGORY_LABELS, STORE_CHIPS } from "@/lib/site-content";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: () => 0,
  "price-asc": (a, b) => a.basePrice - b.basePrice,
  "price-desc": (a, b) => b.basePrice - a.basePrice,
  name: (a, b) => a.name.localeCompare(b.name),
};

const SORT_KEYS: readonly SortKey[] = ["featured", "price-asc", "price-desc", "name"];
const isSortKey = (v: string): v is SortKey => SORT_KEYS.some((k) => k === v);

function SortSelect({ sort, onChange }: { sort: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#6e6e73]">
      Sort by
      <select
        value={sort}
        onChange={(e) => isSortKey(e.target.value) && onChange(e.target.value)}
        className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-1.5 text-sm text-[#1d1d1f]"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name</option>
      </select>
    </label>
  );
}

function ProductGrid({ products }: { products: readonly Product[] }) {
  if (products.length === 0) {
    return <p className="text-[#6e6e73]">No products in this category yet.</p>;
  }
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 tablet:grid-cols-2 wide:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  );
}

export function StorePage({ category }: { category?: CategoryId }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const current = category ? getCategory(category) : undefined;

  const products = useMemo(() => {
    const base = category ? productsByCategory(category) : PRODUCTS;
    return [...base].sort(SORTERS[sort]);
  }, [category, sort]);

  return (
    <PageShell>
      <PageTitle sub={current?.blurb ?? "The best way to buy the products you love."}>
        {current ? `Shop ${STORE_CATEGORY_LABELS[current.id]}` : "Store"}
      </PageTitle>

      {/* The store index follows the reference's measured order: h1 → the
          quick-links strip → the chip row → the editorial rails; the clone's
          superset product grid follows below (session-9). Category pages keep
          their pinned structure (h1 → chips → grid). */}
      {!current && <StoreQuickLinks />}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Product categories">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {STORE_CHIPS.map((chip) => {
              const active = chip.category === category;
              return (
                <li key={chip.label}>
                  <a
                    href={chip.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-1.5 text-sm no-underline transition-colors ${
                      active ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    }`}
                  >
                    {chip.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <SortSelect sort={sort} onChange={setSort} />
      </div>

      {current ? (
        <ProductGrid products={products} />
      ) : (
        <>
          <StoreRails />
          <section aria-labelledby="store-all-products" className="mt-16">
            <h2 id="store-all-products" className="m-0 mb-8 font-display text-[28px] leading-tight font-semibold tracking-[-0.012em]">
              All products.
            </h2>
            <ProductGrid products={products} />
          </section>
        </>
      )}
    </PageShell>
  );
}
