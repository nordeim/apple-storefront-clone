import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { cartCount, cartReducer, cartSubtotal, type CartAction, type CartLine } from "@/lib/cart";

export interface PlacedOrder {
  orderNo: string;
  lines: readonly CartLine[];
  total: number;
  email: string;
}

interface BagValue {
  lines: readonly CartLine[];
  count: number;
  subtotal: number;
  lastOrder: PlacedOrder | null;
  dispatch: (action: CartAction) => void;
  /** Snapshots the bag into `lastOrder`, then empties it. */
  placeOrder: (orderNo: string, email: string) => void;
}

const BagContext = createContext<BagValue | null>(null);

/** The bag and last order live in memory only; nothing is persisted or transmitted. */
export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, [] as CartLine[]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const placeOrder = useCallback(
    (orderNo: string, email: string) => {
      setLastOrder({ orderNo, lines, total: cartSubtotal(lines), email });
      dispatch({ type: "clear" });
    },
    [lines],
  );

  const value = useMemo<BagValue>(
    () => ({ lines, count: cartCount(lines), subtotal: cartSubtotal(lines), lastOrder, dispatch, placeOrder }),
    [lines, lastOrder, placeOrder],
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}
