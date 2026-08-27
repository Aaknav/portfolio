import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { mailto, site } from "@/lib/site";

/**
 * The intake.
 *
 * The rail used to hold the heading and two links — utility, and the reason the
 * section read as the template answer: prose on the left, form on the right.
 * What a hesitant visitor actually wants at this point is not another address;
 * it is to know what happens after they press the button. So the rail answers
 * that, and the two columns become the section's own before and after: what you
 * send, and what comes back.
 *
 * Every line of it is checkable — the reply window matches the success message
 * in lib/actions.ts, and the last step is the promise the lede already makes.
 */
const whatHappens = [
  "You send this. It reaches me directly, not a queue.",
  "I reply within two days, even if the answer is no.",
  "We talk. If I am the wrong fit, I say so and point you elsewhere.",
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border px-6 py-14 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Have a project in mind?"
            lede="Tell me what you’re trying to build — I’ll tell you honestly whether I’m the right fit."
          />
        </Reveal>

        {/* The form comes first on a phone. Reading three reassurances before
            reaching the thing they came to do is the wrong order on a screen
            where everything is stacked. */}
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal delay={0.1} className="order-2 lg:order-1">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="label text-ink-muted">What happens next</p>
                <ol className="flex flex-col">
                  {whatHappens.map((step) => (
                    <li
                      key={step}
                      className="flex gap-3 border-b border-border py-3.5 text-body-sm text-ink-muted first:border-t"
                    >
                      <span aria-hidden="true" className="text-accent">
                        →
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-3">
                <p className="label text-ink-muted">Or reach me directly</p>
                <a
                  href={mailto()}
                  className="text-body text-ink underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {site.email}
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-ink underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="order-1 lg:order-2">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
