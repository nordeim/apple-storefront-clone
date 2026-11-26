import { useEffect, useRef, useState } from "react";
import { useBag } from "@/context/BagContext";
import { CATEGORIES, getProduct } from "@/lib/catalog";
import { describeSelections, lineKey, unitPrice } from "@/lib/cart";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";
import { NAV_LINKS, flyoutLinks, type NavLinkSpec } from "@/lib/site-content";
import { AppleLogoIcon, BagIcon, MenuIcon, SearchIcon } from "./Icons";
import { SearchPanel } from "./SearchPanel";

type Panel = "menu" | "search" | "bag" | null;

function Flyout({ link }: { link: NavLinkSpec }) {
  const isStore = link.id === "store";
  const heading = isStore ? "Shop" : `Explore ${link.label}`;
  const items = isStore
    ? [{ label: "Shop All", href: routeHref.store() }, ...CATEGORIES.map((c) => ({ label: c.label, href: routeHref.store(c.id) }))]
    : link.category
      ? [...flyoutLinks(link.category), { label: `Shop ${link.label}`, href: link.href }]
      : [];
  if (items.length === 0) return null;
  return (
    <div className="flyout" id={`flyout-${link.id}`}>
      <div className="mx-auto max-w-[980px] px-[22px] pt-10 pb-12">
        <p className="mb-4 text-xs text-[#86868b]">{heading}</p>
        <ul className="m-0 grid list-none gap-3 p-0">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="font-display text-2xl font-semibold leading-tight tracking-[0.009em]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BagPopover({ onClose }: { onClose: () => void }) {
  const { lines, subtotal } = useBag();
  return (
    <div
      id="bag-popover"
      role="dialog"
      aria-label="Shopping Bag"
      className="absolute top-[calc(var(--nav-h)-2px)] right-0 w-[min(320px,calc(100vw-24px))] rounded-2xl bg-white p-5 text-left text-[#1d1d1f] shadow-[0_8px_40px_rgba(0,0,0,0.28)]"
    >
      <h2 className="m-0 mb-3 font-display text-xl font-semibold tracking-normal">Bag</h2>
      {lines.length === 0 ? (
        <p className="m-0 text-sm text-[#6e6e73]">Your Bag is empty.</p>
      ) : (
        <>
          <ul className="m-0 mb-3 grid max-h-64 list-none gap-3 overflow-auto p-0">
            {lines.map((line) => {
              const product = getProduct(line.productId);
              if (!product) return null;
              return (
                <li key={lineKey(line.productId, line.selections)} className="flex justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-semibold">{product.name}</span>
                    <span className="block text-xs text-[#6e6e73]">
                      {describeSelections(product, line.selections).join(" · ")} · Qty {line.quantity}
                    </span>
                  </span>
                  <span className="whitespace-nowrap">{formatSgd(unitPrice(product, line.selections) * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <p className="m-0 mb-3 flex justify-between border-t border-[#d2d2d7] pt-3 text-sm font-semibold">
            <span>Subtotal</span>
            <span>{formatSgd(subtotal)}</span>
          </p>
          <a href={routeHref.bag} onClick={onClose} className="button button-block text-center no-underline">
            Review Bag
          </a>
        </>
      )}
    </div>
  );
}

export function GlobalNav() {
  const { count } = useBag();
  const [panel, setPanel] = useState<Panel>(null);
  const [flyoutId, setFlyoutId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = () => {
      setPanel(null);
      setFlyoutId(null);
    };
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  useEffect(() => {
    if (panel === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !headerRef.current?.contains(e.target)) setPanel(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [panel]);

  const toggle = (next: Exclude<Panel, null>) => {
    setFlyoutId(null);
    setPanel((current) => (current === next ? null : next));
  };

  return (
    <header
      ref={headerRef}
      className="globalnav"
      onMouseLeave={() => setFlyoutId(null)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setPanel(null);
          setFlyoutId(null);
        }
      }}
    >
      <nav className="globalnav-bar" aria-label="Global">
        <button
          type="button"
          className="globalnav-icon-button nav:hidden"
          aria-label={panel === "menu" ? "Close menu" : "Menu"}
          aria-expanded={panel === "menu"}
          aria-controls="mobile-menu"
          onClick={() => toggle("menu")}
        >
          <MenuIcon open={panel === "menu"} />
        </button>

        <a href={routeHref.home} className="globalnav-link justify-center nav:w-9" aria-label="Apple Singapore home">
          <AppleLogoIcon />
        </a>

        <ul className="m-0 hidden flex-1 list-none items-center justify-between p-0 pl-2 nav:flex">
          {NAV_LINKS.map((link) => {
            const hasFlyout = link.id === "store" || link.category !== undefined;
            const open = hasFlyout && flyoutId === link.id && panel === null;
            return (
              <li
                key={link.id}
                onMouseEnter={() => hasFlyout && panel === null && setFlyoutId(link.id)}
                onFocus={() => hasFlyout && panel === null && setFlyoutId(link.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setFlyoutId((c) => (c === link.id ? null : c));
                }}
              >
                <a
                  href={link.href}
                  className="globalnav-link px-[0.6em]"
                  aria-expanded={hasFlyout ? open : undefined}
                  aria-controls={hasFlyout ? `flyout-${link.id}` : undefined}
                >
                  {link.label}
                </a>
                {open ? <Flyout link={link} /> : null}
              </li>
            );
          })}
        </ul>

        <div className="relative flex items-center">
          <button
            type="button"
            className="globalnav-icon-button hidden nav:inline-flex"
            aria-label="Search apple.com"
            aria-expanded={panel === "search"}
            aria-controls="search-panel"
            onClick={() => toggle("search")}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="globalnav-icon-button"
            aria-label={count > 0 ? `Shopping Bag, ${count} ${count === 1 ? "item" : "items"}` : "Shopping Bag"}
            aria-expanded={panel === "bag"}
            aria-controls="bag-popover"
            onClick={() => toggle("bag")}
          >
            <BagIcon />
            {count > 0 ? (
              <span className="globalnav-badge" aria-hidden="true">
                {count}
              </span>
            ) : null}
          </button>
          {panel === "bag" ? <BagPopover onClose={() => setPanel(null)} /> : null}
        </div>
      </nav>

      {panel === "search" ? <SearchPanel onClose={() => setPanel(null)} /> : null}

      {panel === "menu" ? (
        <div
          id="mobile-menu"
          className="absolute top-[var(--nav-h)] right-0 left-0 h-[calc(100dvh-var(--nav-h))] overflow-auto bg-[rgba(22,22,23,0.98)] px-[22px] pt-4 pb-10 text-[#f5f5f7] nav:hidden"
        >
          <ul className="m-0 grid list-none gap-1 p-0">
            <li>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 border-0 border-b border-[#424245] bg-transparent py-3 text-left font-display text-[28px] font-semibold text-inherit"
                onClick={() => setPanel("search")}
              >
                <SearchIcon width={18} height={18} /> Search
              </button>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="block border-b border-[#424245] py-3 font-display text-[28px] font-semibold leading-tight text-inherit no-underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
