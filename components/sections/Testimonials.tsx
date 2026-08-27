import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publishableTestimonials } from "@/data/testimonials";

/**
 * Sits directly above the contact form, which is the whole point of it.
 *
 * The advice is consistent across the field: social proof works hardest as
 * reinforcement immediately before the action it is meant to support. Anywhere
 * else on the page it is decoration.
 *
 * Renders nothing at all when there is nothing publishable, so the production
 * site simply does not have this section until real quotes exist — better than
 * an empty heading advertising the absence.
 */
export function Testimonials() {
  const quotes = publishableTestimonials;
  if (quotes.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-border px-6 py-14 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="testimonials-heading"
            eyebrow="In their words"
            title="What working with me is like"
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {quotes.map((testimonial, index) => (
            <Reveal
              key={testimonial.quote}
              delay={index * 0.05}
              as="li"
              className="flex h-full flex-col gap-5 rounded-xl bg-surface p-6 md:p-7"
            >
              <p className="text-body text-ink">
                <span aria-hidden="true" className="text-accent">
                  &ldquo;
                </span>
                {testimonial.quote}
                <span aria-hidden="true" className="text-accent">
                  &rdquo;
                </span>
              </p>

              <div className="mt-auto">
                <p className="text-body-sm font-semibold text-ink">
                  {testimonial.name}
                </p>
                <p className="text-body-sm text-ink-muted">{testimonial.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
