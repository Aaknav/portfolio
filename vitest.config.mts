import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

/**
 * Unit and component tests — the fast layer beneath Playwright.
 *
 * Split of responsibility: anything that can be decided without a browser
 * lives here (validation branches, data invariants, component branching).
 * Real user journeys stay in e2e/ and run against a production build.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],

    /*
     * Vitest's default `include` also matches `*.spec.ts`, which would sweep up
     * the Playwright suite in e2e/ and fail on its `@playwright/test` imports.
     * Unit tests are `*.test.ts(x)` and e2e is excluded outright.
     */
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],

    coverage: {
      provider: "v8",
      include: ["lib/**", "data/**", "components/**", "app/**"],
      reporter: ["text", "html"],
    },
  },
});
