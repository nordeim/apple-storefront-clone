import { afterEach, describe, expect, it, vi } from "vitest";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ErrorBoundary } from "./ErrorBoundary";

// React 19's act() harness contract — without the flag act() warns.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const cleanups: Array<() => void> = [];

function render(node: ReactNode): { container: HTMLElement; root: Root } {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  cleanups.push(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });
  return { container, root };
}

function Boom(): never {
  throw new Error("kaboom");
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    while (cleanups.length > 0) cleanups.pop()?.();
  });

  it("renders children while they are healthy", () => {
    const { container } = render(
      <ErrorBoundary>
        <p>healthy child</p>
      </ErrorBoundary>,
    );
    expect(container.textContent).toContain("healthy child");
  });

  it("renders the fallback with a route home when a child throws", () => {
    // React reports caught render errors through console.error — silence it
    // in this test; the SPA's zero-console contract is what guards prod.
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(container.textContent).toContain("Something went wrong");
    const home = container.querySelector('a[href="#/"]');
    expect(home).not.toBeNull();
    const reload = container.querySelector('button[type="button"]');
    expect(reload).not.toBeNull();
    errorSpy.mockRestore();
  });
});
