# Apple (Singapore) storefront clone

A React 19 + TypeScript (strict) + Tailwind CSS v4 + Vite 7 single-page storefront that reproduces the
structure and visual language of `https://www.apple.com/sg/` and extends it with a working store.
It was built using the conventions of the `ely-beauty` reference repo (CSS-first Tailwind tokens, pure
domain seams in `src/lib/`, unit-tested logic, a browser smoke test, a written evidence dossier).

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Typecheck | `npx tsc --noEmit` |
| Unit tests (Vitest, jsdom) | `npx vitest run` |
| Production build (single file → `dist/index.html`) | `npm run build` |
| Browser smoke test | `npm run build && npm i --no-save playwright && npx playwright install chromium && node tests/e2e/smoke.mjs` |

Clean gate order: `npx tsc --noEmit && npx vitest run && npm run build && node tests/e2e/smoke.mjs`.

## What is in it

**Parity with the reference home page:** blue→charcoal ribbon, translucent global nav with hover flyouts,
3 hero tiles + 6 promo tiles (2-column grid ≥735px), the "Hello, hello." subhead reveal, the PROLED
subhead light sweep, the colour-cycling holiday tile with play/pause, the 9-title Apple TV+ gallery
(auto-advance 4.16 s, dot navigation, pause, swipe, arrow keys), the legal footnotes and the full footer
directory (accordion on ≤734px). Type scale, button geometry (980px pill), tile heights and breakpoints
(734 / 1068) are taken from the reference's CSS.

**Superset:** store with category filters and sorting, product pages with a configurator (options change
price), an in-memory bag with a nav popover, GST-inclusive totals (9%), validated Singapore checkout
(6-digit postal code, 8-digit +65 numbers), order confirmation, order-status lookup, live search
(overlay + results page), entertainment and support pages, 404 handling, skip link, focus management on
navigation, `prefers-reduced-motion` support.

## Architecture

```
src/lib/        pure, tested logic: catalog, cart reducer, router (hash), money, checkout validation, content
src/hooks/      useRoute (hashchange), media-query / in-view hooks
src/context/    BagContext (in-memory only)
src/components/ GlobalNav, SearchPanel, Tile, EntertainmentGallery, Footer, ProductArt (original SVG art)
src/pages/      one file per route
tests/e2e/      Playwright smoke test (45 assertions)
docs/           reference-investigation.md (evidence + deviations ledger)
```

Routing is hash-based (`#/store/mac`, `#/product/iphone-18-pro`) so the single-file build works from
`file://` and any static host. Component CSS lives in `@layer components` so Tailwind utilities can
override it (an unlayered rule would silently beat `nav:hidden`).

## Known limitations

- **Demo data.** Prices, specs and product copy for the catalog are illustrative, not Apple's.
- **Imagery is original SVG art**, not Apple's photography or video; Apple's assets are proprietary and
  were deliberately not copied or hot-linked. The reference's hero videos are not reproduced.
- **No backend.** The bag and last order live in memory and reset on reload; checkout takes no payment and
  sends nothing anywhere. Footer destinations other than the store/support/entertainment pages resolve to
  a placeholder page that says so.
- **Fonts.** The stack is SF Pro → system fonts, as on the reference; machines without SF Pro / Helvetica
  fall back to Arial/DejaVu and will look wider.
- **Not verified:** Safari/WebKit and Firefox (only headless Chromium was run); real-device touch; screen-reader
  output (semantics and ARIA are present but were not exercised with VoiceOver/NVDA); pixel-diff against the
  live site (computed-style token checks were used instead).
- The Apple name, logo and product names are trademarks of Apple Inc. This is an unaffiliated educational clone.
