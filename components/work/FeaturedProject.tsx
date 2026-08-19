import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { TagRow } from "@/components/ui/TagChip";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { HelpdeskPreview } from "@/components/work/HelpdeskPreview";
import { OutcomeVisual } from "@/components/work/OutcomeVisual";

/**
 * Homepage treatment for the flagship project: see the product, then the
 * outcome, then just enough proof. The depth lives on /work/[slug].
 */
export function FeaturedProject({ project }: { project: Project }) {
  const image = project.images[0];
  const showReconstruction = image?.pending;

  return (
    <article>
      {/* The product, at the top and at full width — the largest thing here. */}
      <Reveal>
        <figure className="group overflow-hidden rounded-xl border border-border bg-surface shadow-md">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </span>
            <span className="label ml-2 truncate text-ink-muted">
              {project.name}
            </span>
          </div>

          <div className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.01]">
            {showReconstruction ? (
              <HelpdeskPreview />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1000}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1100px"
                className="h-auto w-full"
              />
            )}
          </div>
        </figure>

        {showReconstruction ? (
          <figcaption className="mt-3 text-body-sm text-ink-muted">
            Interface representation — the production system is client-access
            only.
          </figcaption>
        ) : null}
      </Reveal>

      {/* Identity and the outcome, in three lines. */}
      <Reveal className="mt-10">
        <p className="label text-accent">
          {project.name} · {project.year}
        </p>
        <h3 className="mt-3 max-w-3xl text-display-md md:text-display-lg">
          {project.headline}
        </h3>
        <p className="measure mt-3 text-body-lg text-ink-muted">
          {project.summary}
        </p>
      </Reveal>

      {/* Three outcomes, each readable at a glance. */}
      {project.outcomes ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {project.outcomes.map((outcome, index) => (
            <Reveal key={outcome.title} delay={index * 0.05}>
              <div>
                <OutcomeVisual kind={outcome.visual} />
                <h4 className="mt-3 text-body-lg text-ink">{outcome.title}</h4>
                <p className="mt-1 text-body-sm text-ink-muted">
                  {outcome.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}

      {/* Credibility and technology share one strip — neither leads. */}
      <Reveal className="mt-10">
        <div className="flex flex-col gap-3 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
          {project.proofPoints ? (
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {project.proofPoints.map((point, index) => (
                <li key={point} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-border-strong">
                      ·
                    </span>
                  ) : null}
                  <span className="label text-ink-muted">{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <TagRow items={project.primaryStack} />
        </div>
      </Reveal>

      {/* Conversion, in the project's own voice — a row, not another card. */}
      <Reveal className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-body-lg text-ink">
              Need a system like this?
            </p>
            {project.caseStudy ? (
              <p className="mt-1">
                <Link
                  href={`/work/${project.slug}`}
                  className="text-body-sm text-ink-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
                >
                  Read the full case study
                  <span aria-hidden="true"> →</span>
                </Link>
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {project.links.repo ? (
              <ButtonLink href={project.links.repo} variant="secondary">
                View code <span aria-hidden="true">↗</span>
              </ButtonLink>
            ) : null}
            <ButtonLink href="#contact">
              Start a project <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
