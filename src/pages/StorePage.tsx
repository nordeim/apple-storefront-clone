import { useMemo, useState } from "react";
import { AccessoriesPageSections } from "@/components/AccessoriesSections";
import { AirPodsPageSections } from "@/components/AirPodsSections";
import { PageShell, PageTitle } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { CategoryShelves, StoreQuickLinks, StoreRails } from "@/components/StoreRails";
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

/** The two categories whose reference pages are different families (session-11
 * D14/D15): airpods is the /sg/airpods/ marketing page, accessories is the
 * /sg/shop/accessories/all filtered grid — neither renders the "Shop X" h1. */
const isAirPods = (category: CategoryId): boolean => category === "airpods";
const isAccessories = (category: CategoryId): boolean => category === "accessories";

export function StorePage({ category }: { category?: CategoryId }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const current = category ? getCategory(category) : undefined;
  const airpods = category !== undefined && isAirPods(category);
  const accessories = category !== undefined && isAccessories(category);

  const products = useMemo(() => {
    const base = category ? productsByCategory(category) : PRODUCTS;
    return [...base].sort(SORTERS[sort]);
  }, [category, sort]);

  return (
    <PageShell>
      {/* The AirPods page is the reference's marketing family: an sr-only h1
          (the reference's 1px pagetitle pattern — the same family as the home
          page's h1) over the measured chapternav → heroes → compare →
          consider → music sequence (D14). */}
      {airpods && <h1 className="sr-only">AirPods</h1>}
      {/* The Accessories page is the reference's grid family: the h1 carries
          the reference's exact "Accessories" (not "Shop Accessories") (D15). */}
      {!airpods && (
        <PageTitle sub={current?.blurb ?? "The best way to buy the products you love."}>
          {accessories ? "Accessories" : current ? `Shop ${STORE_CATEGORY_LABELS[current.id]}` : "Store"}
        </PageTitle>
      )}

      {/* The store index follows the reference's measured order: h1 → the
          quick-links strip → the chip row → the editorial rails; the clone's
          superset product grid follows below (session-9). The six device
          category pages carry their measured shelves (session-10); the
          airpods/accessories pages carry their own measured page families
          (session-11). */}
      {!current && <StoreQuickLinks />}

      {airpods && <AirPodsPageSections />}
      {accessories && <AccessoriesPageSections />}

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
        <>
          {/* The four device category pages' measured shelf model (session-10)
              with the clone's working store below: the "All models." shelf
              derives from this catalog (D12), the content shelves carry the
              reference's measured text. Airpods/accessories render their own
              page families above instead (session-11). */}
          <CategoryShelves category={current.id} />
          <section aria-labelledby="store-all-products" className="mt-16">
            <h2 id="store-all-products" className="m-0 mb-8 font-display text-[28px] leading-tight font-semibold tracking-[-0.012em]">
              All products.
            </h2>
            <ProductGrid products={products} />
          </section>
        </>
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
