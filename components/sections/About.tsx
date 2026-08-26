import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

/**
 * The site's argument, turned on the person making it.
 *
 * His own history is the strongest before/after here — years on the using end
 * of ticketing software, then building one — so it carries the heading instead
 * of "Who you'd be working with", which named a page section rather than a fact.
 *
 * One band carries the career, and it is the only structural device here.
 * Earlier versions split that job in two: a thin "used the tools -> built the
 * tools" rule near the top, and a four-cell record of Based / Trading as /
 * Before / Now at the bottom. The two said the same thing at different
 * resolutions, two of the four cells restated the page (Pune is in the hero
 * eyebrow, Aaknav is the wordmark), and the strip floated below the portrait
 * with nothing beside its caption — an obvious dead zone.
 *
 * The "How I work" note about AI-assisted development was cut on request. If it
 * returns it belongs somewhere it is not competing with the portrait for a row.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border px-6 py-14 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="about-heading"
            eyebrow="About"
            title="I was on the using end first."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 md:mt-10">
            <div className="flex flex-col gap-1.5 bg-bg p-5 md:p-6">
              <p className="label text-before-ink">Used the tools</p>
              <p className="text-display-sm text-ink-muted">Software Analyst</p>
              <p className="text-body-sm text-before-ink">
                Capgemini Cloud Operations · two and a half years
              </p>
            </div>
            <div className="flex flex-col gap-1.5 bg-surface p-5 md:p-6">
              <p className="label text-accent">Built the tools</p>
              <p className="text-display-sm text-ink">{site.role}</p>
              <p className="text-body-sm text-ink-muted">
                Independent · {site.location}
              </p>
            </div>
          </div>
        </Reveal>

        {/* items-center, not items-start: the portrait is taller than two
            paragraphs will ever be, and top-aligning them left the text hanging
            off the top edge with a void beneath it. Centred, the shorter column
            reads as deliberate. */}
        <div className="mt-10 grid items-center gap-8 md:mt-14 md:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] lg:gap-16">
          {/* The one human thing on a page of rules and tables, so it gets a
              mount rather than sitting flush — a print in the record, not a
              hero image. The 4:5 crop with a 35% focal point keeps a face
              centred with the background still readable above it. */}
          {site.portrait ? (
            <Reveal delay={0.1}>
              <figure className="flex flex-col gap-3">
                <div className="border border-border bg-surface p-2">
                  <Image
                    src={site.portrait.src}
                    alt={site.portrait.alt}
                    width={744}
                    height={1000}
                    /* The portrait column resolves to ~405px at max-w-6xl:
                       (1152 - 64 gap) x 0.8/2.15 fr, less the mount's padding.
                       Understating this hands 1x screens an upscaled file. */
                    sizes="(min-width: 1024px) 26rem, 100vw"
                    className="aspect-square w-full object-cover object-[center_35%] lg:aspect-[4/5]"
                  />
                </div>
                <figcaption className="label text-center text-ink-muted lg:text-left">
                  {site.portrait.caption}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6 text-body-lg text-ink-muted">
              <p>
                I spent two and a half years as a Software Analyst on
                Capgemini&rsquo;s Cloud Operations team, working hands-on with
                the ticketing platforms and business automation software that
                ran the operation day to day. That isn&rsquo;t incidental
                background — it&rsquo;s why Inventive Helpdesk looks the way it
                does.
              </p>
              <p>
                I joined Inventive Business Solutions as a Business Developer and
                found a problem worth solving: customer issues were arriving
                through email threads and phone calls, with no way to see what
                was open, who owned it, or what had gone quiet. Inventive
                Helpdesk is what replaced that.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
