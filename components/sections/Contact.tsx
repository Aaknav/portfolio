import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { mailto, site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border px-6 py-14 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <div>
            {/* Was hand-rolled markup identical to SectionHeading, which meant
                it silently missed the mobile centring every other intro got. */}
            <SectionHeading
              id="contact-heading"
              eyebrow="Contact"
              title="Have a project in mind?"
              lede="Tell me what you’re trying to build — I’ll tell you honestly whether I’m the right fit."
            />

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 text-center md:text-left">
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

        <Reveal delay={0.05}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
