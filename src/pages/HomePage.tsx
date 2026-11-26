import { EntertainmentGallery } from "@/components/EntertainmentGallery";
import { Ribbon } from "@/components/Ribbon";
import { Tile } from "@/components/Tile";
import { HERO_TILES, PROMO_TILES } from "@/lib/home-content";

export function HomePage() {
  return (
    <>
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
