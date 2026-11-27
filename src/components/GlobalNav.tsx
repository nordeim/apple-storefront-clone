import { useEffect, useRef, useState } from "react";
import { useBag } from "@/context/BagContext";
import { BagLineList } from "@/components/BagLineRow";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";
import { NAV_LINKS, flyoutSections, type FlyoutSection, type NavLinkSpec } from "@/lib/site-content";
import { AppleLogoIcon, BagIcon, ChevronIcon, MenuIcon, SearchIcon } from "./Icons";
import { SearchPanel } from "./SearchPanel";

type Panel = "menu" | "search" | "bag" | null;

function Flyout({ link }: { link: NavLinkSpec }) {
  const sections = flyoutSections(link);
  if (sections.length === 0) return null;
  return (
    <div className="flyout" id={`flyout-${link.id}`}>
      <div className="mx-auto flex max-w-[980px] flex-wrap gap-x-[26px] gap-y-8 px-[22px] pt-10 pb-12">
        {sections.map((s) => (
          <div key={s.heading} className="w-[192px] shrink-0">
            <p className="m-0 mb-4 text-xs text-[#86868b]">{s.heading}</p>
            <ul className="m-0 grid list-none gap-3 p-0">
              {s.links.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="font-display text-2xl font-semibold leading-tight tracking-[0.009em]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One mobile-menu row: the top link navigates (reference behavior), and rows
 * with flyout content carry a separate expand button that reveals the same
 * three-section content the desktop flyout shows. Independent toggles — the
 * same convention as the footer accordion.
 */
function MobileMenuRow({ link, sections }: { link: NavLinkSpec; sections: FlyoutSection[] }) {
  const [open, setOpen] = useState(false);
  const sectionId = `${link.id}-menu-section`;
  return (
    <li className="border-b border-[#424245]">
      <div className="flex items-center">
        <a
          href={link.href}
          className="flex-1 cursor-pointer py-3 font-display text-[28px] font-semibold leading-tight text-inherit no-underline"
        >
          {link.label}
        </a>
        {sections.length > 0 ? (
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-inherit"
            aria-label={`${link.label} menu`}
            aria-expanded={open}
            aria-controls={open ? sectionId : undefined}
            onClick={() => setOpen((v) => !v)}
          >
            <ChevronIcon open={open} />
          </button>
        ) : null}
      </div>
      {open ? (
        <div id={sectionId} className="pb-4">
          {sections.map((s) => (
            <div key={s.heading} className="mb-4">
              <p className="m-0 mb-2 text-xs text-[#86868b]">{s.heading}</p>
              <ul className="m-0 grid list-none gap-2 p-0">
                {s.links.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="inline-block py-2 text-[17px] leading-snug text-[rgba(245,245,247,0.88)] no-underline">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </li>
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
          <BagLineList lines={lines} className="mb-3 max-h-64 overflow-auto" />
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
      {/* Bar layout measured off the live reference: logo flush left, the icon
          cluster (Search, Bag, then the hamburger) flush right on mobile. */}
      <nav className="globalnav-bar px-0 nav:px-[22px]" aria-label="Global">
        <a
          href={routeHref.home}
          className="globalnav-link w-12 nav:w-9 nav:justify-center"
          aria-label="Apple Singapore home"
        >
          <AppleLogoIcon />
        </a>

        <ul className="m-0 hidden flex-1 list-none items-center justify-between p-0 pl-2 nav:flex">
          {NAV_LINKS.map((link) => {
            const hasFlyout = flyoutSections(link).length > 0;
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
                  aria-controls={open ? `flyout-${link.id}` : undefined}
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
            className="globalnav-icon-button w-12 nav:w-9"
            aria-label="Search apple.com"
            aria-expanded={panel === "search"}
            aria-controls={panel === "search" ? "search-panel" : undefined}
            onClick={() => toggle("search")}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="globalnav-icon-button w-12 nav:w-9"
            aria-label={count > 0 ? `Shopping Bag, ${count} ${count === 1 ? "item" : "items"}` : "Shopping Bag"}
            aria-expanded={panel === "bag"}
            aria-controls={panel === "bag" ? "bag-popover" : undefined}
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
          <button
            type="button"
            className="globalnav-icon-button w-12 nav:w-9 nav:hidden"
            aria-label={panel === "menu" ? "Close menu" : "Menu"}
            aria-expanded={panel === "menu"}
            aria-controls={panel === "menu" ? "mobile-menu" : undefined}
            onClick={() => toggle("menu")}
          >
            <MenuIcon open={panel === "menu"} />
          </button>
        </div>
      </nav>

      {panel === "search" ? <SearchPanel onClose={() => setPanel(null)} /> : null}

      {panel === "menu" ? (
        <div
          id="mobile-menu"
          className="absolute top-[var(--nav-h)] right-0 left-0 h-[calc(100dvh-var(--nav-h))] overflow-auto bg-[rgba(22,22,23,0.98)] px-[22px] pt-4 pb-10 text-[#f5f5f7] nav:hidden"
        >
          <ul className="m-0 grid list-none gap-1 p-0">
            {NAV_LINKS.map((link) => (
              <MobileMenuRow key={link.id} link={link} sections={flyoutSections(link)} />
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
