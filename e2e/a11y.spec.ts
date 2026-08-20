import { test, expect } from "@playwright/test";

/**
 * Structural accessibility guards.
 *
 * These are cheap invariants, not an audit — they catch the regressions that
 * creep in during ordinary editing (a second h1, an unlabelled icon button, an
 * image shipped without alt). See e2e/README.md for adding axe-core.
 */

const routes = ["/", "/work/inventive-helpdesk", "/work/bhumita-mehendi"];

for (const route of routes) {
  test.describe(route, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test("has exactly one h1", async ({ page }) => {
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });

    test("every image carries an alt attribute", async ({ page }) => {
      const missing = await page
        .locator("img:not([alt])")
        .evaluateAll((nodes: Element[]) => nodes.map((n) => (n as HTMLImageElement).src));
      expect(missing).toEqual([]);
    });

    /*
     * A <section> without an accessible name is simply not exposed as a
     * landmark, which is fine for layout wrappers. What actually breaks
     * assistive tech is a section that *claims* a name via aria-labelledby
     * pointing at an element that does not exist.
     */
    test("every aria-labelledby resolves to a real element", async ({ page }) => {
      const dangling = await page
        .locator("[aria-labelledby]")
        .evaluateAll((nodes: Element[]) =>
          nodes
            .filter((n) =>
              n
                .getAttribute("aria-labelledby")!
                .split(/\s+/)
                .some((id) => !document.getElementById(id)),
            )
            .map((n) => `${n.tagName.toLowerCase()}#${n.id || "?"}`),
        );
      expect(dangling).toEqual([]);
    });

    test("named sections carry a non-empty name", async ({ page }) => {
      const empty = await page
        .locator("section[aria-labelledby], section[aria-label]")
        .evaluateAll((nodes: Element[]) =>
          nodes
            .filter((n) => {
              const direct = n.getAttribute("aria-label")?.trim();
              if (direct !== undefined) return direct === "";
              const ids = n.getAttribute("aria-labelledby")!.split(/\s+/);
              const text = ids
                .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
                .join("");
              return text === "";
            })
            .map((n) => n.id || n.className),
        );
      expect(empty).toEqual([]);
    });

    test("every link exposes an accessible name", async ({ page }) => {
      const links = page.getByRole("link");
      for (const link of await links.all()) {
        const name = (await link.getAttribute("aria-label")) ?? (await link.innerText());
        expect(name.trim()).not.toBe("");
      }
    });
  });
}

test("keyboard focus produces a visible outline", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    return getComputedStyle(el).outlineStyle;
  });

  expect(outline).not.toBeNull();
  expect(outline).not.toBe("none");
});

test("every form control is labelled", async ({ page }) => {
  await page.goto("/#contact");

  const unlabelled = await page
    .locator("form :is(input, select, textarea)")
    .evaluateAll((nodes: Element[]) =>
      nodes
        .filter((n) => {
          const el = n as HTMLInputElement;
          if (el.type === "hidden" || el.closest("[aria-hidden='true']")) return false;
          return !el.labels?.length && !el.getAttribute("aria-label");
        })
        .map((n) => (n as HTMLElement).id),
    );

  expect(unlabelled).toEqual([]);
});
