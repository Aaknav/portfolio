import { test, expect } from "@playwright/test";
import { navLinks } from "../lib/site";

/**
 * The mobile sheet hand-rolls a focus trap, scroll lock, Escape handling and
 * focus return. That is the kind of behaviour that silently rots, so it is
 * asserted rather than assumed.
 */

test.describe("desktop nav", () => {
  test("exposes every link and jumps to the section", async ({ page, isMobile }) => {
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

test.describe("mobile menu", () => {
  test("opens, traps focus, and closes on Escape", async ({ page, isMobile }) => {
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
