import { useEffect, useRef, useState, type FormEvent } from "react";
import { searchCatalog } from "@/lib/catalog";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";
import { SearchIcon } from "./Icons";

const QUICK_LINKS = [
  { label: "Shop iPhone", href: routeHref.store("iphone") },
  { label: "Shop Mac", href: routeHref.store("mac") },
  { label: "Shop AirPods", href: routeHref.store("airpods") },
  { label: "Entertainment", href: routeHref.entertainment },
  { label: "Support", href: routeHref.support },
];

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchCatalog(query, 6);
  const trimmed = query.trim();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    window.location.hash = routeHref.search(trimmed);
    onClose();
  };

  return (
    <div
      id="search-panel"
      className="absolute top-[var(--nav-h)] right-0 left-0 max-h-[calc(100dvh-var(--nav-h))] overflow-auto bg-[rgba(22,22,23,0.98)] pb-10 text-[#f5f5f7]"
    >
      <div className="mx-auto max-w-[980px] px-[22px] pt-6">
        <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-[#424245] pb-3">
          <SearchIcon width={22} height={22} />
          <label htmlFor="site-search" className="sr-only">
            Search apple.com
          </label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            autoComplete="off"
            maxLength={80}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apple.com"
            className="min-w-0 flex-1 border-0 bg-transparent font-display text-[28px] font-semibold text-[#f5f5f7] placeholder:text-[#6e6e73] focus:outline-none"
          />
        </form>

        <p className="sr-only" aria-live="polite">
          {trimmed ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}
        </p>

        {trimmed ? (
          results.length > 0 ? (
            <ul className="m-0 mt-6 grid list-none gap-1 p-0">
              {results.map((p) => (
                <li key={p.id}>
                  <a
                    href={routeHref.product(p.id)}
                    className="flex items-baseline justify-between gap-4 rounded-lg px-2 py-2 text-[#f5f5f7] no-underline hover:bg-white/10"
                  >
                    <span className="text-base">{p.name}</span>
                    <span className="text-xs text-[#a1a1a6]">From {formatSgd(p.basePrice)}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={routeHref.search(trimmed)} className="block px-2 py-2 text-sm text-[#2997ff] no-underline hover:underline">
                  See all results for “{trimmed}”
                </a>
              </li>
            </ul>
          ) : (
            <p className="mt-6 text-base text-[#a1a1a6]">No results for “{trimmed}”. Try a product name such as iPhone or MacBook.</p>
          )
        ) : (
          <div className="mt-6">
            <p className="mb-2 text-xs text-[#86868b]">Quick Links</p>
            <ul className="m-0 grid list-none gap-1 p-0">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block px-2 py-1.5 text-sm text-[#f5f5f7] no-underline hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
