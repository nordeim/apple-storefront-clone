// ESLint 10 flat config for the React 19 + TypeScript (strict) SPA.
// The vendored skills/ and docs/ libraries are prose, not source — excluded
// from checking, testing and compilation by the repo's standing contract.
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: [
    "dist/**",
    "node_modules/**",
    "skills/**",
    "docs/**",
    "playwright-report/**",
    "test-results/**",
    "public/**",
    // session scratch areas (live-capture JSON + converters — gitignored,
    // never shipped; excluded from checking like skills/ and docs/)
    ".scratch/**",
  ] },
  { files: ["**/*.{ts,tsx}"] },
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
  },
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-refresh": reactRefresh },
    rules: { "react-refresh/only-export-components": "warn" },
  },
);
