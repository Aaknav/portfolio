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

describe("getProject", () => {
  it("resolves every slug the site links to", () => {
    each((p) => expect(getProject(p.slug)?.slug).toBe(p.slug));
  });

  it("returns undefined for an unknown slug so the route can 404", () => {
    expect(getProject("not-a-real-project")).toBeUndefined();
  });
});
