import { EntertainmentGallery } from "@/components/EntertainmentGallery";
import { Ribbon } from "@/components/Ribbon";
import { Tile } from "@/components/Tile";
import { HERO_TILES, PROMO_TILES } from "@/lib/home-content";

export function HomePage() {
  return (
    <>
      {/* The reference's home page carries one sr-only h1 ("Apple", clipped
          via .visuallyhidden) so assistive tech gets a page heading without
          changing the visual hero — mirror the pattern with this clone's own
          site name; every other route already has a visible PageTitle h1. */}
      <h1 className="sr-only">Apple (Singapore)</h1>
      <Ribbon />
      <section className="section section-hero" aria-label="Featured products">
        {HERO_TILES.map((spec) => (
          <Tile key={spec.id} spec={spec} tier="hero" />
        ))}
      </section>
      <section className="section section-promo" aria-label="More to explore">
        {PROMO_TILES.map((spec) => (
          <Tile key={spec.id} spec={spec} tier="promo" />
        ))}
      </section>
      <EntertainmentGallery />
    </>
  );
}
