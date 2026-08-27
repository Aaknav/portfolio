import Link from "next/link";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Two plain cards.
 *
 * This section used to argue in devices — a before/after diptych for one
 * project and a who-makes-the-change table for the other. Good design writing,
 * and more than a customer needs. Someone deciding whether to enquire wants to
 * know what the thing was, what it fixed, and whether it is still running.
 * Three lines each, then a way in.
 */
export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-border px-6 py-14 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="Recent work"
            title="Two systems, both still running"
            lede="Each one replaced a way of working that was quietly costing its owner time."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05}>
              <article className="flex h-full flex-col gap-4 rounded-xl bg-surface p-6 md:p-8">
                <p className="label text-accent">
                  {project.name} · {project.year}
                </p>

                <h3 className="text-display-sm md:text-display-md">
                  {project.headline}
                </h3>

                <p className="text-body text-ink-muted">{project.summary}</p>

                {/* No stack chips and no repo link. A business owner does not
                    buy MariaDB, and both belong on the case study for the
                    people who do care. */}
                <div className="mt-auto pt-2">
                  {project.caseStudy ? (
                    <Link
                      href={`/work/${project.slug}`}
                      className="text-body-sm font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Read how it was built →
                    </Link>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
