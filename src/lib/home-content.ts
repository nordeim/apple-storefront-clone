import type { ArtId } from "./catalog";
import { routeHref } from "./router";

export type TileTheme = "light" | "dark";

export interface TileCta {
  label: string;
  href: string;
  ariaLabel: string;
  variant: "primary" | "secondary";
}

export interface TileSpec {
  id: string;
  theme: TileTheme;
  headline: string;
  subhead: string;
  art: ArtId;
  artLabel: string;
  /** CSS background for the tile. */
  background: string;
  ctas: TileCta[];
}

const learnBuy = (name: string, productId: string): TileCta[] => [
  { label: "Learn more", href: routeHref.product(productId), ariaLabel: `Learn more, ${name}`, variant: "primary" },
  { label: "Buy", href: routeHref.productBuy(productId), ariaLabel: `Buy, ${name}`, variant: "secondary" },
];

export const HERO_TILES: readonly TileSpec[] = [
  {
    id: "holiday-2026",
    theme: "dark",
    headline: "Gifts they’ll love.",
    subhead: "Find their perfect match this holiday season.",
    art: "holiday",
    artLabel: "Montage of Apple products, centred Apple logo gift wrapped in a white bow",
    background: "#3b0a1c",
    ctas: [{ label: "Shop gifts", href: routeHref.store(), ariaLabel: "Shop gifts, Holiday 2026", variant: "primary" }],
  },
  {
    id: "iphone-duo",
    theme: "light",
    headline: "iPhone Duo",
    subhead: "Hello, hello.",
    art: "iphone-duo",
    artLabel: "iPhone Duo, held open in landscape, Star White, photos on the left and apps on the right.",
    background: "linear-gradient(180deg, #f5f5f7 0%, #ebebef 100%)",
    ctas: learnBuy("iPhone Duo", "iphone-duo"),
  },
  {
    id: "iphone-18-pro",
    theme: "dark",
    headline: "iPhone 18 Pro",
    subhead: "Pro further.",
    art: "iphone-18-pro",
    artLabel: "iPhone 18 Pro, rear exterior, against the word PRO in the background.",
    background: "radial-gradient(ellipse at 50% 100%, #2a2f3d 0%, #0a0a0d 60%, #000 100%)",
    ctas: learnBuy("iPhone 18 Pro", "iphone-18-pro"),
  },
];

export const PROMO_TILES: readonly TileSpec[] = [
  {
    id: "apple-homeview",
    theme: "light",
    headline: "Apple HomeView",
    subhead: "Designed for life at home.",
    art: "homeview",
    artLabel: "Apple HomeView display showing a clock, controls and widgets.",
    background: "linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)",
    ctas: learnBuy("Apple HomeView", "apple-homeview"),
  },
  {
    id: "ipad",
    theme: "light",
    headline: "iPad",
    subhead: "Now with the speed of the A16 chip and double the starting storage.",
    art: "ipad",
    artLabel: "iPad in blue with a colourful wallpaper and a row of app icons.",
    background: "linear-gradient(180deg, #f5f5f7 0%, #e6edf7 100%)",
    ctas: learnBuy("iPad", "ipad"),
  },
  {
    id: "apple-watch-series-12",
    theme: "dark",
    headline: "Apple Watch Series 12",
    subhead: "The most accurate heart rate sensing in a wearable.*",
    art: "watch",
    artLabel: "Apple Watch Series 12 showing a heart rate waveform.",
    background: "radial-gradient(ellipse at 50% 90%, #4a1218 0%, #120608 62%, #000 100%)",
    ctas: learnBuy("Apple Watch Series 12", "apple-watch-series-12"),
  },
  {
    id: "macbook-pro-proled-xdr",
    theme: "dark",
    headline: "MacBook Pro",
    subhead: "PROLED XDR Display",
    art: "macbook-proled",
    artLabel: "MacBook Pro with PROLED XDR Display, space black, screen showing glowing striped letters spelling Pro.",
    background: "radial-gradient(ellipse at 50% 70%, #241a45 0%, #0a0a12 65%, #000 100%)",
    ctas: learnBuy("MacBook Pro with PROLED 14 and 16 inch", "macbook-pro-proled"),
  },
  {
    id: "macbook-pro-m6",
    theme: "dark",
    headline: "MacBook Pro",
    subhead: "14-inch model now with M6.",
    art: "macbook-m6",
    artLabel: "MacBook Pro 14-inch in silver with a colourful wallpaper.",
    background: "radial-gradient(ellipse at 50% 70%, #1c2442 0%, #090b14 65%, #000 100%)",
    ctas: learnBuy("MacBook Pro 14 inch", "macbook-pro-m6"),
  },
  {
    id: "airpods-pro-3",
    theme: "light",
    headline: "AirPods Pro 3",
    subhead: "The world’s best in-ear Active Noise Cancellation.",
    art: "airpods",
    artLabel: "AirPods Pro 3 earbuds and charging case.",
    background: "linear-gradient(180deg, #f5f5f7 0%, #ececf0 100%)",
    ctas: learnBuy("AirPods Pro 3", "airpods-pro-3"),
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  href: string;
  /** Two CSS colours for the generated backdrop. */
  colors: [string, string];
}

const TV_BASE = "https://tv.apple.com/sg";

export const TV_GALLERY: readonly GalleryItem[] = [
  { id: "the-family-plan-2", title: "The Family Plan 2", genre: "Comedy", tagline: "Same family. New plan.", href: TV_BASE, colors: ["#ff7a59", "#7b2cbf"] },
  { id: "pluribus", title: "Pluribus", genre: "Drama", tagline: "Happiness is a state of mind.", href: TV_BASE, colors: ["#f9d423", "#ff4e50"] },
  { id: "down-cemetery-road", title: "Down Cemetery Road", genre: "Thriller", tagline: "Curiosity kills.", href: TV_BASE, colors: ["#134e5e", "#71b280"] },
  { id: "slow-horses", title: "Slow Horses", genre: "Thriller", tagline: "MI5’s most unruly spies are back and under attack.", href: TV_BASE, colors: ["#232526", "#7f8c8d"] },
  { id: "knife-edge", title: "Knife Edge: Chasing Michelin Stars", genre: "Documentary", tagline: "Obsession is the main ingredient.", href: TV_BASE, colors: ["#7f1d1d", "#f59e0b"] },
  { id: "the-last-frontier", title: "The Last Frontier", genre: "Action", tagline: "600,000 square miles. Nowhere to hide.", href: TV_BASE, colors: ["#0f2027", "#2c5364"] },
  { id: "the-morning-show", title: "The Morning Show", genre: "Drama", tagline: "The truth is the top story.", href: TV_BASE, colors: ["#1e3c72", "#e96443"] },
  { id: "the-lost-bus", title: "The Lost Bus", genre: "Thriller", tagline: "Inspired by a true story of survival.", href: TV_BASE, colors: ["#b24a00", "#2b1055"] },
  { id: "chief-of-war", title: "Chief of War", genre: "Drama", tagline: "An epic adventure about the origin of Hawai‘i, its people, and a dangerous fight for power.", href: TV_BASE, colors: ["#0b6e4f", "#1d2671"] },
];

export const HOME_FOOTNOTES: readonly string[] = [
  "* Based on data from an Apple-conducted study of heart rate accuracy, during July and August 2026, utilising commercially available best-selling wearables available as of June 2026.",
  "A subscription is required for Apple TV.",
  "Features are subject to change. Some features, applications and services may not be available in all regions or all languages.",
];
