import { test, expect } from "@playwright/test";
import { navLinks } from "../lib/site";

/**
 * The mobile sheet hand-rolls a focus trap, scroll lock, Escape handling and
 * focus return. That is the kind of behaviour that silently rots, so it is
 * asserted rather than assumed.
 */

test.describe("desktop nav", () => {
  test("exposes every link and jumps to the section", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop layout only");
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();

    for (const link of navLinks) {
      await expect(nav.getByRole("link", { name: link.label })).toBeVisible();
    }

    await nav.getByRole("link", { name: navLinks[0].label }).click();
    await expect(page).toHaveURL(new RegExp(`${navLinks[0].href}$`));
  });
});

/*
 * Regression: an anchor whose href already matches the current URL does not
 * navigate, so nothing scrolls. Every in-page link on the site was therefore
 * single-use — reach the contact form once, scroll back up, and the button did
 * nothing on the second press because the hash was still #contact. Clicking
 * once proves nothing here; the second click is the test.
 */
test.describe("in-page anchors", () => {
  test("scroll to their target every time, not just the first", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");

    const openMenu = async () => {
      if (!isMobile) return;
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    };
    const scope = () =>
      isMobile
        ? page.getByRole("dialog", { name: "Menu" })
        : page.locator("header");

    for (const name of [/Get a free quote/, "Work"]) {
      const reached: number[] = [];

      for (let attempt = 0; attempt < 2; attempt += 1) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForFunction(() => window.scrollY === 0);

        await openMenu();
        await scope().getByRole("link", { name }).click();

        await page.waitForFunction(() => window.scrollY > 100, null, {
          timeout: 5000,
        });
        reached.push(await page.evaluate(() => Math.round(window.scrollY)));
      }

      expect(reached[1], `second click on ${name}`).toBeGreaterThan(100);
    }
  });
});

/*
 * Regression: every nav link is an in-page anchor, which means nothing on a
 * page that has no such section. From a case study "#about" resolved to no
 * element, so the click only wrote a fragment onto the case study's own URL and
 * the page did not move. Every existing nav test ran on the homepage, where the
 * sections do exist — which is exactly why none of them saw it.
 */
test.describe("nav from a case study", () => {
  test("sends you back to the homepage section", async ({ page, isMobile }) => {
    await page.goto("/work/inventive-helpdesk");

    const openMenu = async () => {
      if (!isMobile) return page.locator("header");
      await page.getByRole("button", { name: "Open menu" }).click();
      const sheet = page.getByRole("dialog", { name: "Menu" });
      await expect(sheet).toBeVisible();
      return sheet;
    };

    const scope = await openMenu();
    const about = scope.getByRole("link", { name: "About" });

    // The href itself has to be absolute off the homepage, not a bare fragment.
    await expect(about).toHaveAttribute("href", "/#about");

    await about.click();

    await expect(page).toHaveURL(/\/#about$/);
    await page.waitForFunction(() => window.scrollY > 100, null, {
      timeout: 5000,
    });
  });
});

test.describe("mobile menu", () => {
  test("opens, traps focus, and closes on Escape", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile layout only");
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Open menu" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    const sheet = page.getByRole("dialog", { name: "Menu" });
    await expect(sheet).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Focus moves into the sheet rather than being left behind on the trigger.
    await expect(sheet.getByRole("link").first()).toBeFocused();

    // Body scroll is locked while the sheet is open.
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();

    // And focus comes back to where it started.
    await expect(trigger).toBeFocused();
  });

  /*
   * Regression: the sheet used to live inside <header>, which applies
   * backdrop-blur once the page is scrolled. A backdrop-filter makes an element
   * the containing block for its fixed descendants, so `inset-0` resolved
   * against the 64px header strip rather than the viewport — the panel painted
   * only that strip and its links spilled out below it over the page. Opening
   * the menu at the top of the page never reproduced it, so the scroll is the
   * whole point of this test.
   */
  test("fills the viewport when opened after scrolling", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile layout only");
    await page.goto("/");

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForFunction(() => window.scrollY > 0);

    await page.getByRole("button", { name: "Open menu" }).click();
    const sheet = page.getByRole("dialog", { name: "Menu" });
    await expect(sheet).toBeVisible();

    const viewport = page.viewportSize();
    const box = await sheet.boundingBox();
    expect(box, "sheet should have a box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) - 1);

    // And the panel is actually painted, not a transparent frame.
    const background = await sheet.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(background).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("closes when a link is chosen", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile layout only");
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    const sheet = page.getByRole("dialog", { name: "Menu" });
    await sheet.getByRole("link", { name: navLinks[0].label }).click();

    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${navLinks[0].href}$`));
  });
});
