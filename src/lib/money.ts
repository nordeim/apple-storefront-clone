/** Singapore GST rate; retail prices in Singapore are quoted GST-inclusive. */
const GST_RATE_PERCENT = 9;

const WHOLE = new Intl.NumberFormat("en-SG", { maximumFractionDigits: 0 });
const CENTS = new Intl.NumberFormat("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatSgd(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`formatSgd expects a finite, non-negative amount; received ${amount}`);
  }
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return `S$${(hasCents ? CENTS : WHOLE).format(amount)}`;
}

/** GST contained in a GST-inclusive total, rounded to the nearest cent. */
export function gstIncluded(inclusiveTotal: number): number {
  return Math.round(((inclusiveTotal * GST_RATE_PERCENT) / (100 + GST_RATE_PERCENT)) * 100) / 100;
}
