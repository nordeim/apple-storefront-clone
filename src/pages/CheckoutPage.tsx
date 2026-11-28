import { useRef, useState, type FormEvent } from "react";
import { BagLineList } from "@/components/BagLineRow";
import { PageShell, PageTitle } from "@/components/PageShell";
import { useBag } from "@/context/BagContext";
import { validateCheckout, generateOrderNumber, type CheckoutErrors, type CheckoutField, type CheckoutForm } from "@/lib/checkout";
import { routeHref } from "@/lib/router";
import { BagSummary } from "@/components/BagSummary";

const EMPTY: CheckoutForm = { fullName: "", email: "", phone: "", address: "", postalCode: "" };

interface FieldSpec {
  name: CheckoutField;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: "numeric" | "tel" | "email";
  maxLength: number;
}

const FIELDS: readonly FieldSpec[] = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name", maxLength: 80 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", maxLength: 120 },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel", maxLength: 20 },
  { name: "address", label: "Delivery address", type: "text", autoComplete: "street-address", maxLength: 160 },
  { name: "postalCode", label: "Postal code", type: "text", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 },
];

export function CheckoutPage() {
  const { lines, subtotal, placeOrder } = useBag();
  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (lines.length === 0) {
    return (
      <PageShell narrow>
        <PageTitle sub="Add something to your Bag before checking out.">Your Bag is empty.</PageTitle>
        <a href={routeHref.store()} className="button px-8 py-3">
          Continue shopping
        </a>
      </PageShell>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateCheckout(form);
    setErrors(found);
    const firstInvalid = FIELDS.find((f) => found[f.name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const orderNo = generateOrderNumber();
    placeOrder(orderNo, form.email.trim());
    window.location.hash = routeHref.confirmation(orderNo);
  };

  return (
    <PageShell>
      <PageTitle sub="Demo checkout: no payment is taken and no data leaves your browser.">Check out.</PageTitle>
      <div className="grid items-start gap-12 wide:grid-cols-[1fr_380px]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5" aria-label="Delivery details">
          {FIELDS.map((f) => {
            const error = errors[f.name];
            const id = `checkout-${f.name}`;
            return (
              <div key={f.name} className="grid gap-1.5">
                <label htmlFor={id} className="text-sm font-semibold">
                  {f.label}
                </label>
                <input
                  id={id}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  inputMode={f.inputMode}
                  maxLength={f.maxLength}
                  value={form[f.name]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({ ...prev, [f.name]: value }));
                    if (errors[f.name]) setErrors((prev) => ({ ...prev, [f.name]: undefined }));
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className={`rounded-xl border bg-white px-4 py-3 text-[17px] ${error ? "border-[#e30000]" : "border-[#d2d2d7]"}`}
                />
                {error ? (
                  <p id={`${id}-error`} role="alert" className="m-0 text-sm text-[#e30000]">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
          <button type="submit" disabled={submitting} className="button button-block mt-2">
            {submitting ? "Placing order…" : "Place Order"}
          </button>
        </form>

        <aside aria-label="Order summary" className="rounded-[20px] bg-[#f5f5f7] p-6">
          <BagLineList lines={lines} className="mb-6" />
          <BagSummary subtotal={subtotal} />
        </aside>
      </div>
    </PageShell>
  );
}
