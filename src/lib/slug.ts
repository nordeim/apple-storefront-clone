/** The one label→slug grammar for every info route in the app (extracted to
 * its own module in session 9 so the store-rails seam can share it without a
 * module cycle — site-content still re-exports it for its importers). */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
