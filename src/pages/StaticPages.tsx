import { useState, type FormEvent } from "react";
import { EntertainmentGallery } from "@/components/EntertainmentGallery";
import { PageShell, PageTitle } from "@/components/PageShell";
import { useBag } from "@/context/BagContext";
import { ORDER_NO, routeHref } from "@/lib/router";
import { INFO_TITLES, slugify, SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/site-content";

const SERVICES = [
  { title: "Apple TV+", copy: "Award-winning originals, films and live sports." },
  { title: "Apple Music", copy: "Over 100 million songs, ad-free, with lossless audio." },
  { title: "Apple Arcade", copy: "Unlimited access to a catalogue of games with no ads." },
  { title: "Apple Fitness+", copy: "Workouts and meditations for every level." },
  { title: "Apple Podcasts", copy: "Shows from every genre, free to follow." },
  { title: "Apple Books", copy: "Millions of titles, from bestsellers to audiobooks." },
];

export function EntertainmentPage() {
  return (
    <>
      <PageShell>
        <PageTitle sub="Stream, listen, play and read. All on Apple devices.">Entertainment</PageTitle>
      </PageShell>
      <EntertainmentGallery />
      <PageShell>
        <ul className="m-0 grid list-none gap-6 p-0 tablet:grid-cols-2 wide:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.title} className="rounded-[20px] bg-[#f5f5f7] p-6">
              <h2 className="m-0 mb-2 font-display text-2xl font-semibold tracking-normal">{s.title}</h2>
              <p className="m-0 text-[15px] text-[#6e6e73]">{s.copy}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-[#6e6e73]">A subscription is required for Apple TV.</p>
      </PageShell>
    </>
  );
}

const SUPPORT_TOPICS = ["Order Status", "Shopping Help", "Apple Trade In", "Financing", "Genius Bar", "Contact Apple"];

export function SupportPage() {
  const { lastOrder } = useBag();
  const [orderNo, setOrderNo] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const lookup = (e: FormEvent) => {
    e.preventDefault();
    const candidate = orderNo.trim().toUpperCase();
    if (!ORDER_NO.test(candidate)) {
      setResult("Enter an order number in the form EL-XXXXXXXX.");
    } else if (lastOrder?.orderNo === candidate) {
      setResult(`Order ${candidate} is confirmed and being prepared for free delivery.`);
    } else {
      setResult(`We can’t find ${candidate} in this session. Orders in this demo are kept in memory only.`);
    }
  };

  return (
    <PageShell>
      <PageTitle sub="Get help with your order, your devices and your services.">Support</PageTitle>
      <ul className="m-0 mb-12 grid list-none gap-4 p-0 tablet:grid-cols-2 wide:grid-cols-3">
        {SUPPORT_TOPICS.map((t) => (
          <li key={t}>
            <a
              href={routeHref.info(slugify(t))}
              className="block rounded-[20px] bg-[#f5f5f7] p-6 font-display text-xl font-semibold text-inherit no-underline hover:bg-[#ececf0]"
            >
              {t}
            </a>
          </li>
        ))}
      </ul>

      <section aria-labelledby="order-status-heading" className="mb-12 max-w-xl">
        <h2 id="order-status-heading" className="m-0 mb-3 font-display text-2xl font-semibold tracking-normal">
          Check an order
        </h2>
        <form onSubmit={lookup} className="flex gap-3">
          <label htmlFor="order-lookup" className="sr-only">
            Order number
          </label>
          <input
            id="order-lookup"
            value={orderNo}
            maxLength={11}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="EL-XXXXXXXX"
            className="min-w-0 flex-1 rounded-xl border border-[#d2d2d7] px-4 py-3 text-[17px]"
          />
          <button type="submit" className="button px-6">
            Check
          </button>
        </form>
        <p role="status" className="mt-3 mb-0 min-h-6 text-[15px] text-[#6e6e73]">
          {result}
        </p>
      </section>

      <p className="m-0 text-[17px]">
        Prefer to talk? Call{" "}
        <a href={SUPPORT_PHONE_TEL} className="link-cta">
          {SUPPORT_PHONE_DISPLAY}
        </a>
        .
      </p>
    </PageShell>
  );
}

export function InfoPage({ slug }: { slug: string }) {
  const title = INFO_TITLES.get(slug);
  if (!title) return <NotFoundPage />;
  return (
    <PageShell narrow>
      <PageTitle>{title}</PageTitle>
      <p className="text-[17px] text-[#6e6e73]">
        This destination is part of the site directory but is outside the scope of this storefront demo, so it has no content of its own.
      </p>
      <a href={routeHref.home} className="link-cta">
        Back to Apple
      </a>
    </PageShell>
  );
}

export function NotFoundPage() {
  return (
    <PageShell narrow>
      <PageTitle sub="The page you’re looking for may have moved, or the address may be mistyped.">We couldn’t find that page.</PageTitle>
      <div className="flex flex-wrap gap-4">
        <a href={routeHref.home} className="button px-8 py-3">
          Go to Apple
        </a>
        <a href={routeHref.store()} className="button button-secondary px-8 py-3">
          Visit the Store
        </a>
      </div>
    </PageShell>
  );
}
