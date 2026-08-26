import { describe, expect, it } from "vitest";
import {
  featuredProjects,
  getProject,
  otherProjects,
  projects,
  type Project,
} from "@/data/projects";

/**
 * "Adding a project is a data change, never a layout change" — which means the
 * layout quietly assumes things about this data. These tests pin the contracts
 * the components rely on, so a malformed entry fails here in milliseconds
 * rather than as a broken card, a 404, or a missing alt attribute in Playwright.
 */

const each = (fn: (project: Project) => void) =>
  projects.forEach((project) => fn(project));

describe("identity", () => {
  it("ships at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses URL-safe slugs", () => {
    each((p) => expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });

  it("fills every field the cards render", () => {
    each((p) => {
      for (const field of ["name", "year", "tagline", "headline", "summary"] as const) {
        expect(p[field].trim(), `${p.slug}.${field}`).not.toBe("");
      }
    });
  });
});

describe("homepage contracts", () => {
  it("gives exactly three outcomes when outcomes are present", () => {
    each((p) => {
      if (p.outcomes) expect(p.outcomes, `${p.slug}.outcomes`).toHaveLength(3);
    });
  });

  it("keeps primaryStack to the four or five the strip can show", () => {
    each((p) => {
      expect(p.primaryStack.length, `${p.slug}.primaryStack`).toBeGreaterThanOrEqual(4);
      expect(p.primaryStack.length, `${p.slug}.primaryStack`).toBeLessThanOrEqual(5);
    });
  });

  it("keeps summaries to a single sentence", () => {
    each((p) => {
      const sentences = p.summary.match(/[.!?](\s|$)/g) ?? [];
      expect(sentences.length, `${p.slug}.summary`).toBeLessThanOrEqual(1);
    });
  });

  it("features at least one project for the homepage hero", () => {
    expect(featuredProjects.length).toBeGreaterThan(0);
  });

  it("partitions cleanly into featured and other", () => {
    expect(featuredProjects.length + otherProjects.length).toBe(projects.length);
  });
});

describe("links and images", () => {
  it("uses absolute https URLs for live and repo links", () => {
    each((p) => {
      for (const url of [p.links.live, p.links.repo].filter(Boolean)) {
        expect(url, `${p.slug}.links`).toMatch(/^https:\/\//);
      }
    });
  });

  it("explains the absence of a live link rather than leaving a gap", () => {
    each((p) => {
      if (!p.links.live) {
        expect(p.links.liveNote?.trim(), `${p.slug}.links.liveNote`).toBeTruthy();
      }
    });
  });

  it("gives every image real alt text", () => {
    each((p) => {
      expect(p.images.length, `${p.slug}.images`).toBeGreaterThan(0);
      for (const image of p.images) {
        expect(image.alt.trim(), `${p.slug} image alt`).not.toBe("");
        /* "image of" / "screenshot of" is noise a screen reader already says. */
        expect(image.alt.toLowerCase()).not.toMatch(/^(image|screenshot|picture) of/);
        expect(image.src, `${p.slug} image src`).toMatch(/^\//);
      }
    });
  });
});

describe("case studies", () => {
  it("gives each case study a problem, a solution and sections", () => {
    each((p) => {
      if (!p.caseStudy) return;
      expect(p.caseStudy.problem.trim(), `${p.slug}.problem`).not.toBe("");
      expect(p.caseStudy.solution.trim(), `${p.slug}.solution`).not.toBe("");
      expect(p.caseStudy.sections.length, `${p.slug}.sections`).toBeGreaterThan(0);
    });
  });

  it("gives every case-study section a heading and a body", () => {
    each((p) => {
      p.caseStudy?.sections.forEach((section, i) => {
        expect(section.heading.trim(), `${p.slug}.sections[${i}].heading`).not.toBe("");
        expect(section.body.trim(), `${p.slug}.sections[${i}].body`).not.toBe("");
      });
    });
  });

  it("lists a full stack across all three layers", () => {
    each((p) => {
      if (!p.caseStudy) return;
      const { frontend, backend, infra } = p.caseStudy.fullStack;
      for (const [layer, items] of Object.entries({ frontend, backend, infra })) {
        expect(items.length, `${p.slug}.fullStack.${layer}`).toBeGreaterThan(0);
      }
    });
  });
});

/**
 * The before/after devices read straight from this data and make assumptions
 * the type cannot express: entries are used as React keys, and BeforeAfter only
 * styles the first three scraps. A duplicate string here surfaces as a React key
 * error in the browser, which smoke.spec.ts turns into a four-browser failure —
 * these turn the same mistake into a millisecond unit failure instead.
 */
describe("before / after devices", () => {
  it("keeps before scraps unique and non-empty", () => {
    each((p) => {
      if (!p.before) return;
      expect(new Set(p.before).size, `${p.slug}.before duplicates`).toBe(
        p.before.length,
      );
      p.before.forEach((scrap, i) =>
        expect(scrap.trim(), `${p.slug}.before[${i}]`).not.toBe(""),
      );
    });
  });

  it("keeps before scraps to the three BeforeAfter can style", () => {
    each((p) => {
      if (!p.before) return;
      expect(p.before.length, `${p.slug}.before`).toBeLessThanOrEqual(3);
    });
  });

  it("keeps after rows unique and fully populated", () => {
    each((p) => {
      if (!p.after) return;
      const items = p.after.map((row) => row.item);
      expect(new Set(items).size, `${p.slug}.after duplicates`).toBe(items.length);
      p.after.forEach((row, i) => {
        expect(row.item.trim(), `${p.slug}.after[${i}].item`).not.toBe("");
        expect(row.state.trim(), `${p.slug}.after[${i}].state`).not.toBe("");
      });
    });
  });

  it("pairs before with after, since the device needs both halves", () => {
    each((p) =>
      expect(Boolean(p.before), `${p.slug} before/after pairing`).toBe(
        Boolean(p.after),
      ),
    );
  });

  it("keeps handover rows unique and non-empty", () => {
    each((p) => {
      if (!p.handover) return;
      expect(new Set(p.handover).size, `${p.slug}.handover duplicates`).toBe(
        p.handover.length,
      );
      p.handover.forEach((row, i) =>
        expect(row.trim(), `${p.slug}.handover[${i}]`).not.toBe(""),
      );
    });
  });

  it("gives every handover project the live link that section leads with", () => {
    each((p) => {
      if (!p.handover) return;
      expect(p.links.live, `${p.slug}.links.live`).toBeTruthy();
    });
  });

  it("gives the homepage's flagship the pair the hero renders", () => {
    const flagship = projects.filter((p) => p.featured)[0];
    expect(flagship, "no featured project for the hero").toBeDefined();
    expect(flagship?.before?.length, "flagship.before").toBeGreaterThan(0);
    expect(flagship?.after?.length, "flagship.after").toBeGreaterThan(0);
  });
});

describe("getProject", () => {
  it("resolves every slug the site links to", () => {
    each((p) => expect(getProject(p.slug)?.slug).toBe(p.slug));
  });

  it("returns undefined for an unknown slug so the route can 404", () => {
    expect(getProject("not-a-real-project")).toBeUndefined();
  });
});
