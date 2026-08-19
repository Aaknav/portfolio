import type { Project } from "@/data/projects";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { TagRow } from "@/components/ui/TagChip";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Compact treatment for non-featured projects. Deliberately lighter than
 * FeaturedProject — image beside copy, no full panel — so it never competes
 * with the flagship case study above it.
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
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-display-md">{project.name}</h3>
          <span className="label text-ink-muted">{project.year}</span>
        </header>

        <p className="mt-3 text-body text-ink-muted">{project.solution}</p>

        {project.engineering ? (
          <p className="mt-4 text-body-sm text-ink-muted">
            {project.engineering}
          </p>
        ) : null}

        <div className="mt-6">
          <TagRow
            items={[
              ...project.stack.frontend.slice(0, 2),
              ...project.stack.backend.slice(0, 2),
              ...project.stack.infra.slice(0, 1),
            ]}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
      </div>
    </article>
  );
}
