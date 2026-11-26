import { useId, useState } from "react";
import { useMediaQuery } from "@/hooks/browser";
import { FOOTER_GROUPS, LEGAL_LINKS, SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL, type FooterSection } from "@/lib/site-content";
import { routeHref } from "@/lib/router";

function Section({ section, accordion }: { section: FooterSection; accordion: boolean }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const list = (
    <ul className="footer-col-list" id={listId} hidden={accordion && !open}>
      {section.links.map((l) => (
        <li key={l.href}>
          <a href={l.href}>{l.label}</a>
        </li>
      ))}
    </ul>
  );

  if (!accordion) {
    return (
      <section aria-label={section.title}>
        <h3 className="footer-col-title">{section.title}</h3>
        {list}
      </section>
    );
  }

  return (
    <section className="border-b border-[#d2d2d7]" aria-label={section.title}>
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-3 text-left text-xs font-semibold text-[#1d1d1f]"
        >
          {section.title}
          <span aria-hidden="true" className="text-lg font-normal text-[#6e6e73]">
            {open ? "\u2212" : "+"}
          </span>
        </button>
      </h3>
      {list}
    </section>
  );
}

export function Footer({ notes = [] }: { notes?: readonly string[] }) {
  const accordion = useMediaQuery("(max-width: 734px)");

  return (
    <footer className="footer" aria-label="Apple footer">
      <div className="footer-inner">
        {notes.length > 0 ? (
          <div className="footer-legal-notes">
            {notes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
        ) : null}

        <div className={accordion ? "pt-2" : "footer-directory"}>
          {FOOTER_GROUPS.map((group, i) => (
            <div key={i}>
              {group.map((section) => (
                <Section key={section.title} section={section} accordion={accordion} />
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-[#d2d2d7] pt-4 pb-1 max-md:border-t-0">
          <p className="m-0 mb-3">
            More ways to shop: <a href={routeHref.info("find-a-store")} className="underline">Find an Apple Store</a> or{" "}
            <a href={routeHref.info("shopping-help")} className="underline">a retailer</a> near you. Or call{" "}
            <a href={SUPPORT_PHONE_TEL} className="underline">{SUPPORT_PHONE_DISPLAY}</a>.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#d2d2d7] py-4 md:flex-row md:items-center md:justify-between">
          <p className="m-0">Copyright © 2026 Apple Inc. All rights reserved.</p>
          <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
            {LEGAL_LINKS.map((l, i) => (
              <li key={l.href} className={i < LEGAL_LINKS.length - 1 ? "border-r border-[#d2d2d7] pr-4" : ""}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <p className="m-0">
            <a href={routeHref.info("singapore")}>Singapore</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
