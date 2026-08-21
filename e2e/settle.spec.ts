import { expect, test } from "@playwright/test";
import { settleAnimations } from "./helpers";

/**
 * Guards the helper the axe scans depend on.
 *
 * Every assertion in axe.spec.ts assumes the page has stopped fading before it
 * is read. When that assumption broke, it surfaced as a confusing colour-contrast
 * violation against a composited half-transparent colour that appears nowhere in
 * the design system — twice. This turns that failure mode into a direct, legible
 * one: it fails here, naming the real problem, instead of over in the a11y suite.
 */
const routes = ["/", "/work/inventive-helpdesk", "/work/bhumita-mehendi"];

for (const route of routes) {
  test(`${route} has no mid-animation elements once settled`, async ({ page }) => {
    await page.goto(route);
    await settleAnimations(page);

    const unsettled = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('[style*="opacity"]'))
        .filter((el) => getComputedStyle(el).opacity !== "1")
        .map((el) => ({
          opacity: getComputedStyle(el).opacity,
          html: el.outerHTML.slice(0, 120),
        })),
    );

    expect(unsettled, `\n${JSON.stringify(unsettled, null, 2)}\n`).toEqual([]);
  });
}
