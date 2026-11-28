import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useInView, usePrefersReducedMotion } from "@/hooks/browser";
import { TV_GALLERY } from "@/lib/home-content";
import { PauseIcon, PlayIcon } from "./Icons";

/** Per-slide dwell time, matching the reference gallery's data-ac-gallery-item-duration. */
const DWELL_MS = 4160;
const SWIPE_THRESHOLD_PX = 50;

export function EntertainmentGallery() {
  const total = TV_GALLERY.length;
  const reducedMotion = usePrefersReducedMotion();
  const [rootRef, inView] = useInView<HTMLElement>(0.3);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [interacting, setInteracting] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const paused = userPaused ?? reducedMotion;
  const autoplay = inView && !paused && !interacting;

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => go(index + 1), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, go]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const target = e.key === "Home" ? 0 : total - 1;
      go(target);
      tabRefs.current[target]?.focus();
      return;
    }
    if (delta === 0) return;
    e.preventDefault();
    const target = (index + delta + total) % total;
    go(target);
    tabRefs.current[target]?.focus();
  };

  const onPointerDown = (e: PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      ref={rootRef}
      className="gallery"
      aria-roledescription="carousel"
      aria-label="Gallery of Apple TV shows, movies, and sports."
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
    >
      <div
        className="gallery-viewport"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStartX.current = null)}
      >
        <div className="gallery-track m-0 p-0" style={{ "--i": index } as CSSProperties}>
          {TV_GALLERY.map((item, i) => {
            const active = i === index;
            return (
              <div
                key={item.id}
                id={`tv-gallery-item-${i + 1}`}
                role="tabpanel"
                aria-labelledby={`tv-gallery-item-${i + 1}-trigger`}
                className="gallery-card theme-dark"
                data-active={active}
                aria-hidden={!active}
                style={{ backgroundImage: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }}
              >
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.22),transparent_55%),linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.65))]" />
                <a
                  href={item.href}
                  tabIndex={active ? 0 : -1}
                  aria-label={`Stream now, ${item.title} - ${item.genre} - ${item.tagline}`}
                  draggable={false}
                >
                  <span className="flex items-center gap-3" aria-hidden="true">
                    <span className="rounded-md bg-white/90 px-2 py-0.5 font-display text-sm font-bold tracking-tight text-black">tv+</span>
                    <span className="font-display text-[clamp(22px,3.4vw,44px)] leading-[1.05] font-semibold tracking-tight">{item.title}</span>
                  </span>
                  <span className="flex flex-col items-start gap-3" aria-hidden="true">
                    <span className="button" style={{ background: "#f5f5f7", color: "#1d1d1f" }}>
                      Stream now
                    </span>
                    <span className="max-w-[560px] text-[15px] leading-snug text-white/90">
                      <strong className="mr-2 font-semibold">{item.genre}</strong>
                      {item.tagline}
                    </span>
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="gallery-controls">
        <div className="dotnav" role="tablist" aria-label="Choose a title">
          {TV_GALLERY.map((item, i) => {
            const selected = i === index;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tv-gallery-item-${i + 1}-trigger`}
                aria-controls={`tv-gallery-item-${i + 1}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className="dotnav-dot"
                data-static={!autoplay}
                style={{ "--dwell": `${DWELL_MS}ms` } as CSSProperties}
                onClick={() => go(i)}
                onKeyDown={onTabKeyDown}
              >
                <span className="sr-only">{`Item ${i + 1} - ${item.title}`}</span>
                {selected ? <span className="dotnav-progress" aria-hidden="true" key={`${index}-${autoplay}`} /> : null}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="dotnav-control"
          aria-label={paused ? "Play Apple TV+ gallery" : "Pause Apple TV+ gallery"}
          onClick={() => setUserPaused(!paused)}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </section>
  );
}
