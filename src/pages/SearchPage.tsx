import { useState, type FormEvent } from "react";
import { PageShell, PageTitle } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { searchCatalog } from "@/lib/catalog";
import { routeHref } from "@/lib/router";

export function SearchPage({ query }: { query: string }) {
  const [draft, setDraft] = useState(query);
  const trimmed = query.trim();
  const results = searchCatalog(trimmed, 24);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = draft.trim();
    if (next) window.location.hash = routeHref.search(next);
  };

  return (
    <PageShell>
      <PageTitle>{trimmed ? `Results for “${trimmed}”` : "Search"}</PageTitle>
      <form role="search" onSubmit={submit} className="mb-10 flex max-w-xl gap-3">
        <label htmlFor="search-page-input" className="sr-only">
          Search products
        </label>
        <input
          id="search-page-input"
          type="search"
          value={draft}
          maxLength={80}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search products"
          className="min-w-0 flex-1 rounded-xl border border-[#d2d2d7] px-4 py-3 text-[17px]"
        />
        <button type="submit" className="button px-6">
          Search
        </button>
      </form>

      <div role="status">
        {trimmed && results.length === 0 ? (
          <p className="text-[#6e6e73]">
            No products match “{trimmed}”. Try a product name like iPhone, or{" "}
            <a href={routeHref.store()} className="link-cta">
              browse the Store
            </a>
            .
          </p>
        ) : null}
      </div>
      {results.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 tablet:grid-cols-2 wide:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      ) : null}
    </PageShell>
  );
}
