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
 * Drive every `Reveal` to its settled state, then confirm the fades finished.
 *
 * Reveal animates `opacity: 0 -> 1` on scroll into view, and Motion deliberately
 * keeps opacity animations running under prefers-reduced-motion — it only drops
 * transform and layout animations, so the global `reducedMotion: "reduce"` does
 * not settle them.
 *
 * That matters for axe specifically: axe reads the *composited* colour of an
 * element, so a scan that lands mid-fade sees half-transparent text over the
 * page ground and reports contrast failures that do not exist a moment later.
 *
 * Two earlier versions of this helper were not reliable, and both failures are
 * worth keeping in mind:
 *
 * 1. Accepting an opacity of exactly 0 as "settled". 0 is also what a Reveal
 *    reads as *before* it starts, so an untriggered reveal counted as done and
 *    then faded in mid-scan. That is how the last Process step slipped through
 *    on CI, which is slow enough for the gap to open.
 * 2. Scrolling the page top to bottom on a fixed dwell and then sampling. On a
 *    loaded machine WebKit does not reliably fire `whileInView` for everything
 *    a fast programmatic scroll passes over, so elements stayed at 0 for good
 *    once the page returned to the top and they were out of view again.
 *
 * So this drives rather than samples: it repeatedly finds whatever is still not
 * fully opaque and scrolls that specific element into view until nothing is
 * left. Self-correcting, and it does not assume any engine's observer timing.
 *
 * Requiring full opacity is safe here — nothing on this site rests at an inline
 * opacity of 0. The only inline opacities come from Reveal and HeroStagger,
 * both of which end at 1, and the mobile sheet is conditionally rendered rather
 * than faded out.
 */
export async function settleAnimations(page: Page) {
  await page.waitForLoadState("networkidle");

  await page.evaluate(async () => {
    const unsettled = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]'),
      ).filter((el) => getComputedStyle(el).opacity !== "1");

    const pause = () => new Promise((resolve) => setTimeout(resolve, 120));

    for (let attempt = 0; attempt < 100; attempt += 1) {
      const pending = unsettled();
      if (pending.length === 0) break;

      /* Bring the first unsettled element into view so its viewport observer
         fires; anything near it triggers in the same pass. */
      pending[0].scrollIntoView({ block: "center" });
      await pause();
    }

    window.scrollTo(0, 0);
  });

  /* Already true if the loop converged; this turns a failure to converge into a
     clear error rather than a mid-fade scan. */
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>('[style*="opacity"]')).every(
        (el) => getComputedStyle(el).opacity === "1",
      ),
    null,
    { timeout: 15_000 },
  );
}
