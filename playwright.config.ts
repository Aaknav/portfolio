import { defineConfig, devices } from "@playwright/test";

/**
 * E2E configuration.
 *
 * The dev server runs on a dedicated port so a `npm run dev` you already have
 * open on 3000 is never torn down or scribbled on by a test run.
 *
 * WEB3FORMS_ACCESS_KEY is forced empty for the server under test: the contact
 * action only reaches Web3Forms once zod has passed, and with no key it bails
 * before the network. A test can never send a real enquiry.
 */

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,

  /* A stray `test.only` should fail the build, not silently shrink the run. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",

    /*
     * globals.css sets `scroll-behavior: smooth`, so landing on /#contact
     * animates the form across the viewport while a test is trying to click
     * it. The site already disables that under prefers-reduced-motion, so
     * asking for it here removes the moving target — and settles the Reveal
     * animations — using the site's own supported path rather than a hack.
     */
    contextOptions: { reducedMotion: "reduce" },
  },

  /**
   * Snapshot defaults are configured but no baselines exist yet — see
   * e2e/README.md. Generating them on this machine would bake in local font
   * rendering and diff against CI forever.
   */
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      scale: "css",
    },
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  /*
   * Tests run against a production build, not `next dev`. It matches what
   * actually ships, it catches build-time failures as part of the gate, and it
   * sidesteps Next's refusal to run a second dev server for the same directory
   * while you have one open on 3000.
   */
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      WEB3FORMS_ACCESS_KEY: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
