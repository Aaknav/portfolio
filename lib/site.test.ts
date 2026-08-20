import { describe, expect, it } from "vitest";
import { mailto, navLinks, site } from "@/lib/site";

describe("mailto", () => {
  it("defaults to a project enquiry subject", () => {
    expect(mailto()).toBe(
      `mailto:${site.email}?subject=Project%20enquiry`,
    );
  });

  it("percent-encodes subjects so spaces and symbols survive the mail client", () => {
    const href = mailto("Helpdesk & dashboard — budget?");

    expect(href).toContain("%26");
    expect(href).toContain("%3F");
    expect(href).not.toMatch(/subject=.*[ &?]/);
  });
});

describe("navLinks", () => {
  it("points at in-page anchors, not routes", () => {
    for (const link of navLinks) expect(link.href).toMatch(/^#[a-z-]+$/);
  });

  it("has a label for every link and no duplicate targets", () => {
    const hrefs = navLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const link of navLinks) expect(link.label.trim()).not.toBe("");
  });
});

describe("site", () => {
  it("uses an absolute canonical URL with no trailing slash", () => {
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith("/")).toBe(false);
  });

  it("keeps the SEO title within what search results actually render", () => {
    expect(site.title.length).toBeLessThanOrEqual(70);
  });

  it("keeps the meta description within the usual truncation point", () => {
    expect(site.description.length).toBeLessThanOrEqual(165);
  });
});
