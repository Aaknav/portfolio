import type { Page } from "@playwright/test";

/**
 * Wait until React has hydrated the given element.
 *
 * Server-rendered markup is clickable long before React attaches to it. A
 * click that lands in that window falls through to a native form POST instead
 * of the `useActionState` handler, the page navigates, and the assertion that
 * follows finds a freshly rendered page with no error state on it. Firefox is
 * consistently slower to hydrate than Chromium here, which is why it flaked
 * first.
 *
 * React tags every node it owns with a `__reactFiber$…` / `__reactProps$…`
 * key, so the presence of one is a genuine hydration signal rather than a
 * timing guess.
 */
export async function waitForHydration(page: Page, selector = "form") {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some(
        (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactProps$"),
      );
    },
    selector,
    { timeout: 15_000 },
  );
}


/**
 * Drive every `Reveal` to its settled state, then wait for the fades to finish.
 *
 * Reveal animates `opacity: 0 -> 1` on scroll into view, and Motion deliberately
 * keeps opacity animations running under prefers-reduced-motion — it only drops
 * transform and layout animations, so the global `reducedMotion: "reduce"` does
 * not settle them.
 *
 * That matters for axe specifically: axe reads the *composited* colour of an
 * element, so a scan that lands mid-fade sees half-transparent text over the
 * page ground and reports contrast failures that do not exist a moment later.
 * That produced exactly the kind of intermittent, engine-dependent failure that
 * teaches people to distrust the suite.
 */
export async function settleAnimations(page: Page) {
  await page.waitForLoadState("networkidle");

  /* `whileInView` only fires once an element has entered the viewport, so walk
     the page top to bottom before waiting on anything. `once: true` means they
     stay settled after we scroll back up. */
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight, 1);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });

  /* Motion writes the in-flight value to inline style, so a fractional inline
     opacity anywhere means something is still fading. */
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>("[style*=opacity]")).every(
        (el) => {
          const value = Number.parseFloat(el.style.opacity);
          return Number.isNaN(value) || value === 0 || value === 1;
        },
      ),
    null,
    { timeout: 10_000 },
  );
}
