import { test, expect } from "@playwright/test";
import { waitForHydration } from "./helpers";

/**
 * The contact form is the site's one conversion path, so its failure modes
 * matter more than its happy path.
 *
 * Nothing here can send a real enquiry: playwright.config.ts starts the server
 * with WEB3FORMS_ACCESS_KEY empty, and every case below fails zod before the action
 * would reach Web3Forms anyway.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/#contact");
  // The form must be hydrated before it is driven — see helpers.ts.
  await waitForHydration(page, "form");
});

test("an empty submission reports each missing field", async ({ page }) => {
  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page.getByText("Enter your name")).toBeVisible();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText(/Tell me a little more/)).toBeVisible();

  // Scoped to the form: Next injects its own role="alert" route announcer.
  await expect(page.locator("form [role='alert']")).toContainText(
    "Please check the fields below.",
  );
});

test("invalid fields are marked for assistive tech", async ({ page }) => {
  await page.getByRole("button", { name: "Send enquiry" }).click();

  const name = page.getByLabel("Name", { exact: true });
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "name-error");
});

test("rejects a malformed email but keeps valid input", async ({ page }) => {
  await page.getByLabel("Name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await page
    .getByLabel("What are you trying to build?")
    .fill("A reasonably long message that clears the twenty character minimum.");

  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Enter your name")).toBeHidden();
});


test("the honeypot stays hidden from people", async ({ page }) => {
  const honeypot = page.locator("#website");

  await expect(honeypot).toBeAttached();
  await expect(honeypot).toBeHidden();
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
});
