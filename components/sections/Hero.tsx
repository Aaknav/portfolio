import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroStagger } from "@/components/motion/Reveal";
import { BeforeAfter } from "@/components/work/BeforeAfter";
import { featuredProjects } from "@/data/projects";

/**
 * The hero is the thesis, stated once: nobody buys a ticketing system, they buy
 * the end of a mess. The headline crosses the seam the diptych below draws, so
 * the sentence and the picture make the same argument.
 */
export function Hero() {
  const flagship = featuredProjects[0];

  return (
    <section className="px-6 pt-20 pb-10 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-6xl text-center md:text-left">
        <HeroStagger index={0}>
          <p className="label text-ink-muted">
            Full-stack development · {site.location}
          </p>
        </HeroStagger>

        <HeroStagger index={1}>
          <h1 className="mx-auto mt-6 max-w-[19ch] text-[2.25rem] leading-[1.04] tracking-[-0.035em] md:mx-0 md:text-display-xl">
            Before, it lived in a shared inbox.{" "}
            <span className="text-accent">After, it had an owner.</span>
          </h1>
        </HeroStagger>

        <HeroStagger index={2}>
          <p className="measure mx-auto mt-6 text-body-lg text-ink-muted md:mx-0">
            I&rsquo;m {site.name} — I build the systems small businesses run on,
            and the websites that bring people to them. Every project below
            started as something that was not working.
          </p>
        </HeroStagger>

        <HeroStagger index={3}>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
            <ButtonLink href="#contact" size="lg">
              Start a project
              <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href="#work" variant="secondary" size="lg">
              See the before and after
            </ButtonLink>
          </div>
        </HeroStagger>

        {site.availability ? (
          <HeroStagger index={4}>
            <p className="mt-6 flex items-center justify-center gap-2 text-body-sm text-ink-muted md:justify-start">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-success"
              />
              {site.availability}
            </p>
          </HeroStagger>
        ) : null}

        {flagship ? (
          <HeroStagger index={5}>
            <div className="mt-12 text-left md:mt-14">
              <BeforeAfter project={flagship} />
              {/* Proof points come from the project, never a literal: the
                  flagship is whichever entry is featured first, and a hardcoded
                  test count would follow the slot rather than the project. */}
              {flagship.proofPoints?.length ? (
                <p className="mt-4 text-body-sm text-ink-muted">
                  {flagship.proofPoints.join(" · ")}
                </p>
              ) : null}
            </div>
          </HeroStagger>
        ) : null}
      </div>
    </section>
  );
}
