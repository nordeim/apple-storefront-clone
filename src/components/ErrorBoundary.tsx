import { Component, type ErrorInfo, type ReactNode } from "react";
import { PageShell, PageTitle } from "./PageShell";
import { routeHref } from "@/lib/router";

interface BoundaryState {
  failed: boolean;
}

/**
 * Page-level render guard: if any route view throws during render, keep the
 * global shell (nav, bag state, footer, skip link) alive and render a
 * graceful fallback instead of a blank root. Wraps `RouteView` in `App.tsx`
 * — deliberately NOT the whole app, so the nav and its bag popover survive a
 * route crash and remain usable from the fallback.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    // The one sanctioned console.error in src/: a caught render error is an
    // observable failure (the e2e zero-console contract guards prod health).
    console.error("ErrorBoundary caught a render error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <PageShell narrow>
        <PageTitle sub="The page hit an unexpected error. The rest of the site keeps working.">
          Something went wrong.
        </PageTitle>
        <div className="flex flex-wrap gap-4">
          <a href={routeHref.home} className="button px-8 py-3">
            Return to the homepage
          </a>
          <button
            type="button"
            className="button button-secondary cursor-pointer px-8 py-3"
            onClick={() => window.location.reload()}
          >
            Reload the page
          </button>
        </div>
      </PageShell>
    );
  }
}
