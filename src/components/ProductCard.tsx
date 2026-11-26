import { memo } from "react";
import type { ArtId, Product } from "@/lib/catalog";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";
import { ProductArt } from "./ProductArt";

const DARK_ART: ReadonlySet<ArtId> = new Set<ArtId>(["iphone-18-pro", "watch", "macbook-proled", "macbook-m6", "vision", "tv", "holiday"]);

export function artSurface(art: ArtId): string {
  return DARK_ART.has(art) ? "radial-gradient(ellipse at 50% 100%, #2a2f3d 0%, #0a0a0d 70%)" : "linear-gradient(180deg, #f5f5f7, #e8e8ed)";
}

export function ArtPanel({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] ${className}`} style={{ background: artSurface(product.art) }}>
      <div className="absolute inset-0 [&>svg]:absolute [&>svg]:bottom-0 [&>svg]:left-1/2 [&>svg]:h-full [&>svg]:w-auto [&>svg]:-translate-x-1/2 [&>svg]:[aspect-ratio:1000/700]">
        <ProductArt id={product.art} label={`${product.name}`} />
      </div>
    </div>
  );
}

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <li className="m-0 list-none">
      <a href={routeHref.product(product.id)} className="group block text-inherit no-underline">
        <ArtPanel product={product} className="aspect-[10/8] transition-transform duration-300 group-hover:scale-[1.015]" />
        <h2 className="mt-4 mb-1 font-display text-2xl leading-tight font-semibold tracking-normal">{product.name}</h2>
        <p className="m-0 text-[15px] leading-snug text-[#6e6e73]">{product.tagline}</p>
        <p className="mt-2 mb-0 text-[15px] font-semibold">From {formatSgd(product.basePrice)}</p>
      </a>
    </li>
  );
});
