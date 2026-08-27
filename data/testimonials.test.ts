import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The interesting invariant is not the shape of a quote — it is that a
 * placeholder can never reach production. That rule lives behind
 * `publishableTestimonials`, so this exercises it through that interface
 * rather than reaching past it.
 *
 * `env` is validated once at import, so each case re-imports the module with a
 * different environment rather than stubbing after the fact.
 */
const envMock = vi.hoisted(() => ({ VERCEL_ENV: undefined as string | undefined }));
vi.mock("@/lib/env", () => ({ env: envMock }));

const load = async () => {
  vi.resetModules();
  return import("@/data/testimonials");
};

beforeEach(() => {
  envMock.VERCEL_ENV = undefined;
});

describe("publishable testimonials", () => {
  it("hides every placeholder on production", async () => {
    envMock.VERCEL_ENV = "production";
    const { publishableTestimonials } = await load();

    expect(publishableTestimonials.every((t) => !t.placeholder)).toBe(true);
  });

  it("shows placeholders in a preview deployment, where they are useful", async () => {
    envMock.VERCEL_ENV = "preview";
    const { publishableTestimonials, testimonials } = await load();

    expect(publishableTestimonials.length).toBe(testimonials.length);
  });

  it("shows placeholders locally, where there is no VERCEL_ENV at all", async () => {
    const { publishableTestimonials, testimonials } = await load();

    expect(publishableTestimonials.length).toBe(testimonials.length);
  });
});

describe("every testimonial", () => {
  it("carries a quote, a name and a role", async () => {
    const { testimonials } = await load();

    testimonials.forEach((t, i) => {
      expect(t.quote.trim(), `testimonials[${i}].quote`).not.toBe("");
      expect(t.name.trim(), `testimonials[${i}].name`).not.toBe("");
      expect(t.role.trim(), `testimonials[${i}].role`).not.toBe("");
    });
  });

  it("keeps quotes unique, since the quote is the React key", async () => {
    const { testimonials } = await load();
    const quotes = testimonials.map((t) => t.quote);

    expect(new Set(quotes).size).toBe(quotes.length);
  });

  it("names a placeholder as one, so it cannot be mistaken for a real client", async () => {
    const { testimonials } = await load();

    testimonials
      .filter((t) => t.placeholder)
      .forEach((t, i) =>
        expect(t.name.toLowerCase(), `placeholder[${i}].name`).toContain(
          "placeholder",
        ),
      );
  });
});
