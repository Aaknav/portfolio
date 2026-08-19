import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroStagger } from "@/components/motion/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { featuredProjects } from "@/data/projects";

export function Hero() {
  const heroImage = featuredProjects[0]?.images[0];

  return (
    <section className="px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <HeroStagger index={0}>
            <p className="label text-accent">Full-stack development</p>
          </HeroStagger>

          <HeroStagger index={1}>
            <h1 className="mt-5 text-[2.5rem] leading-[1.08] md:text-display-xl">
              Websites that win customers.
              <br />
              Software that runs your business.
            </h1>
          </HeroStagger>

          <HeroStagger index={2}>
            <p className="measure mt-6 text-body-lg text-ink-muted">
              I&rsquo;m a full-stack developer who builds both — from the
              marketing site that brings people in, to the ticketing systems,
              dashboards and internal tools that keep a business running once
              they&rsquo;re through the door.
            </p>
          </HeroStagger>

          <HeroStagger index={3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contact" size="lg">
                Start a project
                <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="#work" variant="secondary" size="lg">
                View my work
              </ButtonLink>
            </div>
          </HeroStagger>

          {site.availability ? (
            <HeroStagger index={4}>
              <p className="mt-6 flex items-center gap-2 text-body-sm text-ink-muted">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-success"
                />
                {site.availability}
              </p>
            </HeroStagger>
          ) : null}
        </div>

        {heroImage ? (
          <HeroStagger index={4}>
            <BrowserFrame
              image={heroImage}
              priority
              label="Inventive Helpdesk"
            />
          </HeroStagger>
        ) : null}
      </div>
    </section>
  );
}
