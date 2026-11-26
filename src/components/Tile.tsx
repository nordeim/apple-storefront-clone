import { useState, type CSSProperties } from "react";
import { useInView, usePrefersReducedMotion } from "@/hooks/browser";
import type { TileSpec } from "@/lib/home-content";
import { PauseIcon, PlayIcon } from "./Icons";
import { HOLIDAY_PALETTES, ProductArt, type HolidayColor } from "./ProductArt";

type Tier = "hero" | "promo";

const HOLIDAY_COLORS: readonly HolidayColor[] = ["pink", "blue", "green", "yellow"];

function Subhead({ spec }: { spec: TileSpec }) {
  const [ref, revealed] = useInView<HTMLElement>(0.4);

  if (spec.id === "iphone-duo") {
    return (
      <p className="tile-subhead typography-tile-subhead">
        <span className="sr-only">{spec.subhead}</span>
        <span ref={ref} className={`duo-subhead${revealed ? " is-revealed" : ""}`} aria-hidden="true">
          <span className="duo-left">
            <span className="duo-end">Hello, </span>
            <span className="duo-start">Hello.</span>
          </span>
          <span className="duo-right">hello.</span>
        </span>
      </p>
    );
  }

  if (spec.id === "macbook-pro-proled-xdr") {
    return (
      <p className="tile-subhead typography-tile-subhead">
        <span ref={ref} className={`sweep-text${revealed ? " is-revealed" : ""}`}>
          {spec.subhead}
        </span>
      </p>
    );
  }

  return <p className="tile-subhead typography-tile-subhead">{spec.subhead}</p>;
}

export function Tile({ spec, tier }: { spec: TileSpec; tier: Tier }) {
  const Heading = tier === "hero" ? "h2" : "h3";
  const reducedMotion = usePrefersReducedMotion();
  const [holidayColor] = useState<HolidayColor>(
    () => HOLIDAY_COLORS[Math.floor(Math.random() * HOLIDAY_COLORS.length)] ?? "pink",
  );
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const isHoliday = spec.id === "holiday-2026";
  const playing = userPlaying ?? !reducedMotion;

  const background = isHoliday ? HOLIDAY_PALETTES[holidayColor].background : spec.background;
  const artLabel = isHoliday ? `${spec.artLabel}, ${HOLIDAY_PALETTES[holidayColor].label}` : spec.artLabel;
  const primaryHref = spec.ctas[0]?.href ?? "#/store";

  return (
    <div
      className={`tile${spec.theme === "dark" ? " theme-dark" : ""}`}
      data-tile-id={spec.id}
      data-playing={isHoliday ? String(playing) : undefined}
      style={{ "--tile-bg": background } as CSSProperties}
    >
      <a className="tile-link" href={primaryHref} aria-hidden="true" tabIndex={-1} />
      <div className="tile-content">
        <div className="tile-copy">
          <Heading className="tile-headline typography-tile-headline">{spec.headline}</Heading>
          <Subhead spec={spec} />
        </div>
        <div className="tile-ctas">
          {spec.ctas.map((cta) => (
            <a
              key={cta.label}
              className={`button${cta.variant === "secondary" ? " button-secondary" : ""}`}
              href={cta.href}
              aria-label={cta.ariaLabel}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
      <div className="tile-art">
        <ProductArt id={spec.art} label={artLabel} holiday={holidayColor} />
      </div>
      {isHoliday ? (
        <button
          type="button"
          className="tile-play"
          aria-label={playing ? "Pause Holiday 2026 animation" : "Play Holiday 2026 animation"}
          aria-pressed={!playing}
          onClick={() => setUserPlaying(!playing)}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      ) : null}
    </div>
  );
}
