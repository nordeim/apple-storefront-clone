import { routeHref } from "@/lib/router";

export function Ribbon() {
  return (
    <section className="ribbon" aria-label="Shop online">
      <div className="ribbon-inner">
        <a href={routeHref.store()}>Shop online</a> and get Specialist help, free delivery and more. Get&nbsp;in&#8209;stock items with
        Apple&nbsp;Pickup.
      </div>
    </section>
  );
}
