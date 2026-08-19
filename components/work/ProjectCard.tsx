import Link from "next/link";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { TagRow } from "@/components/ui/TagChip";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Compact treatment for non-featured projects. Deliberately lighter than
 * FeaturedProject — image beside copy — so it never competes with the flagship.
 *
 * At two projects this is a single row; at ten it is a grid. Same component.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
      {project.images[0] ? (
        <BrowserFrame image={project.images[0]} label={project.name} />
      ) : null}

      <div>
        <p className="label text-accent">
          {project.name} · {project.year}
        </p>

        <h3 className="mt-4 text-display-md">{project.headline}</h3>

        <p className="mt-3 text-body text-ink-muted">{project.summary}</p>

        <div className="mt-6">
          <TagRow items={project.primaryStack} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.links.live ? (
            <ButtonLink href={project.links.live} variant="secondary">
              View live <span aria-hidden="true">↗</span>
            </ButtonLink>
          ) : null}
          {project.links.repo ? (
            <ButtonLink href={project.links.repo} variant="secondary">
              View code <span aria-hidden="true">↗</span>
            </ButtonLink>
          ) : null}
        </div>

        {project.caseStudy ? (
          <p className="mt-5">
            <Link
              href={`/work/${project.slug}`}
              className="text-body-sm text-ink underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-accent"
            >
              Read the case study<span aria-hidden="true"> →</span>
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
