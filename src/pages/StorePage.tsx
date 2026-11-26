import { useMemo, useState } from "react";
import { PageShell, PageTitle } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, getCategory, productsByCategory, type CategoryId, type Product } from "@/lib/catalog";
import { routeHref } from "@/lib/router";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: () => 0,
  "price-asc": (a, b) => a.basePrice - b.basePrice,
  "price-desc": (a, b) => b.basePrice - a.basePrice,
  name: (a, b) => a.name.localeCompare(b.name),
};

const SORT_KEYS: readonly SortKey[] = ["featured", "price-asc", "price-desc", "name"];
const isSortKey = (v: string): v is SortKey => SORT_KEYS.some((k) => k === v);

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
        {current ? `Shop ${current.label}` : "Store"}
      </PageTitle>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Product categories">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {[{ id: undefined, label: "All" }, ...CATEGORIES].map((c) => {
              const active = c.id === category;
              return (
                <li key={c.id ?? "all"}>
                  <a
                    href={routeHref.store(c.id)}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-1.5 text-sm no-underline transition-colors ${
                      active ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    }`}
                  >
                    {c.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <label className="flex items-center gap-2 text-sm text-[#6e6e73]">
          Sort by
          <select
            value={sort}
            onChange={(e) => isSortKey(e.target.value) && setSort(e.target.value)}
            className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-1.5 text-sm text-[#1d1d1f]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <p className="text-[#6e6e73]">No products in this category yet.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 tablet:grid-cols-2 wide:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      )}
    </PageShell>
  );
}
