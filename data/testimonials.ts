import { env } from "@/lib/env";

/**
 * What clients said, and the rule that keeps invented quotes off the live site.
 *
 * The interface here is deliberately one export: `publishableTestimonials`. A
 * caller renders that and needs to know nothing else — not that placeholders
 * exist, not which environment it is running in, not how the two interact. Put
 * the filter in the component instead and every future caller has to remember
 * to apply it; forget once and the site is telling a stranger that a client
 * said something they never said.
 *
 * So the danger lives behind the interface. `placeholder: true` entries render
 * locally and in preview deployments — where they are useful for design work —
 * and are dropped on production. Replacing one with a real quote is deleting
 * one line.
 *
 * The rule at the top of data/projects.ts applies here with more force: nothing
 * on this site may claim an outcome that did not happen, and a fabricated
 * client is the worst version of that.
 */
export type Testimonial = {
  quote: string;
  /** The person, as they would want to be named. */
  name: string;
  /** Their role and business — "Owner, Bhumita Mehendi". */
  role: string;
  /**
   * Written by us, not by a client. Never rendered on production.
   * Delete this line when a real quote replaces the copy.
   */
  placeholder?: boolean;
};

const all: Testimonial[] = [
  {
    quote:
      "Support used to arrive by email and phone and half of it went quiet. Now every request has an owner and a status, and I can see what is open without asking anyone.",
    name: "Placeholder name",
    role: "Operations lead, Inventive Business Solutions",
    placeholder: true,
  },
  {
    quote:
      "I can add photos and change prices myself now. I used to wait days for a small edit, and it always felt like an imposition.",
    name: "Placeholder name",
    role: "Owner, Bhumita Mehendi",
    placeholder: true,
  },
  {
    quote:
      "He told me plainly that half of what I asked for was not worth building. That is the reason I trusted the other half.",
    name: "Placeholder name",
    role: "Founder, placeholder client",
    placeholder: true,
  },
];

/** Every entry, real or placeholder. For tests and tooling, not for rendering. */
export const testimonials = all;

/**
 * The only list the site should render.
 *
 * Placeholders survive locally and in previews, and never reach production.
 */
export const publishableTestimonials = all.filter(
  (testimonial) =>
    !testimonial.placeholder || env.VERCEL_ENV !== "production",
);
