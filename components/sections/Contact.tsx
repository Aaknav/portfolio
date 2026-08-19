import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { mailto, site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="label text-accent">Contact</p>
            <h2 id="contact-heading" className="mt-4 text-display-md md:text-display-lg">
              Have a project in mind?
            </h2>
            <p className="measure-tight mt-4 text-body-lg text-ink-muted">
              Tell me what you&rsquo;re trying to build — I&rsquo;ll tell you
              honestly whether I&rsquo;m the right fit.
            </p>

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8">
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
