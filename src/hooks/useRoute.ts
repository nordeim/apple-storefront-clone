import { useMemo, useSyncExternalStore } from "react";
import { parseHash, type Route } from "@/lib/router";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;

export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, () => "");
}

export function useRoute(): { route: Route; hash: string } {
  const hash = useHash();
  const route = useMemo(() => parseHash(hash), [hash]);
  return { route, hash };
}
