import Link from "next/link";
import { projects, featuredProjects } from "@/data/projects";
import { BeforeAfter } from "@/components/work/BeforeAfter";
import { OwnerHandover } from "@/components/work/OwnerHandover";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TagRow } from "@/components/ui/TagChip";

/**
 * Every project is a pair. The flagship's pair is already the hero, so here it
 * leads with its outcomes instead of repeating the same diptych two screens
 * apart — the reader has seen the picture, this is the explanation.
 */
export function Work() {
  const flagshipSlug = featuredProjects[0]?.slug;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-border px-6 py-14 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="Selected work"
            title="What changed"
            lede="Two systems in production. Each one replaced something that was quietly costing its owner time."
          />
        </Reveal>

        <div className="mt-10 flex flex-col gap-14 md:mt-14 md:gap-20">
          {projects.map((project) => (
            <Reveal key={project.slug}>
              <article className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  {/* Name and year. The stack used to be printed here too,
                      so every project named Next.js and TypeScript twice inside
                      one block; the chip row below carries it now. */}
                  <p className="label text-ink-muted">
                    {project.name} · {project.year}
                  </p>
                  <h3 className="max-w-[22ch] text-display-md md:text-display-lg">
                    {project.headline}
                  </h3>
                  <p className="measure text-body text-ink">
                    {project.summary}
                  </p>
                </div>

                {/* One argument, three shapes. The flagship's diptych is already
                    the hero, so it leads with outcomes; an owner-run site argues
                    independence instead; anything else falls back to the pair. */}
                {project.slug === flagshipSlug && project.outcomes ? (
                  <ul className="grid gap-px border border-border bg-border sm:grid-cols-3">
                    {project.outcomes.map((outcome) => (
                      <li
                        key={outcome.title}
                        className="flex flex-col gap-2 bg-surface p-5"
                      >
                        <p className="label text-accent">{outcome.title}</p>
                        <p className="text-body-sm text-ink-muted">
                          {outcome.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : project.handover ? (
                  <OwnerHandover project={project} />
                ) : (
                  <BeforeAfter project={project} />
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <TagRow items={project.primaryStack} />
                  <div className="flex flex-wrap gap-5">
                    {project.caseStudy ? (
                      <Link
                        href={`/work/${project.slug}`}
                        className="label text-accent underline-offset-4 hover:underline"
                      >
                        Read the build{" "}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : null}
                    {/* OwnerHandover prints the live link for the projects
                        it renders, so this covers everything else. */}
                    {project.links.live && !project.handover ? (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label text-accent underline-offset-4 hover:underline"
                      >
                        Visit the site <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {project.links.repo ? (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label text-accent underline-offset-4 hover:underline"
                      >
                        View code <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
