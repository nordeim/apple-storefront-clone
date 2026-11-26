import { PageShell, PageTitle } from "@/components/PageShell";
import { useBag } from "@/context/BagContext";
import { formatSgd } from "@/lib/money";
import { routeHref } from "@/lib/router";

export function ConfirmationPage({ orderNo }: { orderNo: string }) {
  const { lastOrder } = useBag();
  const order = lastOrder?.orderNo === orderNo ? lastOrder : null;

  if (!order) {
    return (
      <PageShell narrow>
        <PageTitle sub="Orders in this demo are kept in memory only, so a refreshed page can’t show it.">
          We can’t find order {orderNo}.
        </PageTitle>
        <a href={routeHref.store()} className="button px-8 py-3">
          Continue shopping
        </a>
      </PageShell>
    );
  }

  return (
    <PageShell narrow>
      <PageTitle sub={`A confirmation would be sent to ${order.email}.`}>Thank you. Your order is placed.</PageTitle>
      <dl className="m-0 mb-8 grid gap-2 rounded-[20px] bg-[#f5f5f7] p-6 text-[15px]">
        <div className="flex justify-between">
          <dt>Order number</dt>
          <dd className="m-0 font-semibold" data-testid="order-number">
            {order.orderNo}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Items</dt>
          <dd className="m-0">{order.lines.reduce((n, l) => n + l.quantity, 0)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Total (GST included)</dt>
          <dd className="m-0 font-semibold">{formatSgd(order.total)}</dd>
        </div>
      </dl>
      <p className="mb-8 text-sm text-[#6e6e73]">This is a demonstration storefront. No payment was processed and no order was sent anywhere.</p>
      <a href={routeHref.store()} className="button px-8 py-3">
        Continue shopping
      </a>
    </PageShell>
  );
}
