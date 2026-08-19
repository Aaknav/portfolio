import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading id="about-heading" eyebrow="About" title="Who you'd be working with" />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="measure mt-10 flex flex-col gap-6 text-body-lg text-ink-muted">
            <p>
              I&rsquo;m {site.name} — I build as {site.brand}, out of Pune.
            </p>
            <p>
              Before this I spent two and a half years as a Software Analyst on
              Capgemini&rsquo;s Cloud Operations team, working hands-on with the
              ticketing platforms and business automation software that ran the
              operation day to day. That isn&rsquo;t incidental background —
              it&rsquo;s why Inventive Helpdesk looks the way it does. I spent
              years on the using end of tools like it before I built one.
            </p>
            <p>
              I joined Inventive Business Solutions as a Business Developer and
              found a problem worth solving: customer issues were arriving
              through email threads and phone calls, with no way to see what was
              open, who owned it, or what had gone quiet. Inventive Helpdesk is
              what replaced that.
            </p>
            <p>
              I use modern tools, including AI-assisted development, to move
              faster without cutting corners — the same way any developer today
              reaches for a linter, a framework or a code generator. The result
              is what matters, and that&rsquo;s what&rsquo;s on this page.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
