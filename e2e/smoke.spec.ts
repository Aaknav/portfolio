import { test, expect } from "@playwright/test";
import { site, navLinks } from "../lib/site";

/**
 * The floor: every route renders, nothing errors in the console, and the
 * homepage still contains the sections the nav promises.
 */

test.describe("homepage", () => {
  test("renders with the expected title and headline", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(site.title);

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Software that runs your business");
  });

  test("contains every section the nav links to", async ({ page }) => {
    await page.goto("/");

    for (const link of navLinks) {
      const id = link.href.replace("#", "");
      await expect(page.locator(`#${id}`)).toBeAttached();
    }

    await expect(page.locator("#contact")).toBeAttached();
    await expect(page.locator("#main")).toBeAttached();
  });

  test("loads without console errors or failed requests", async ({ page }) => {
    const problems: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (request) => {
      // Fonts and analytics can fail offline without the page being broken.
      const url = request.url();
      if (url.includes("fonts.gstatic.com")) return;
      problems.push(`requestfailed: ${url}`);
    });

    await page.goto("/", { waitUntil: "networkidle" });
    expect(problems).toEqual([]);
  });
});

test.describe("case studies", () => {
  for (const slug of ["inventive-helpdesk", "bhumita-mehendi"]) {
    test(`/work/${slug} renders`, async ({ page }) => {
      const response = await page.goto(`/work/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("an unknown slug 404s", async ({ page }) => {
    const response = await page.goto("/work/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});

test.describe("crawlability", () => {
  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");
  });
});
