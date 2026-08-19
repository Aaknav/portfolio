import type { Project } from "@/data/projects";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { TagRow } from "@/components/ui/TagChip";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 md:p-12">
      <Reveal>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-display-md md:text-display-lg">{project.name}</h3>
          <span className="label text-ink-muted">{project.year}</span>
        </header>
        <p className="measure mt-3 text-body-lg text-ink-muted">
          {project.tagline}
        </p>
      </Reveal>

      {project.images[0] ? (
        <Reveal className="mt-10">
          <BrowserFrame image={project.images[0]} label={project.name} />
        </Reveal>
      ) : null}

      <Reveal className="mt-12">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h4 className="label text-accent">Problem</h4>
            <p className="mt-3 text-body text-ink-muted">{project.problem}</p>
          </div>
          <div>
            <h4 className="label text-accent">Solution</h4>
            <p className="mt-3 text-body text-ink-muted">{project.solution}</p>
          </div>
        </div>
      </Reveal>

      {project.features ? (
        <Reveal className="mt-12">
          <h4 className="label text-accent">What it does</h4>
          <ul className="mt-4 grid gap-x-12 gap-y-3 md:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 text-body-sm text-ink-muted"
              >
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-accent" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {project.engineering ? (
        <Reveal className="mt-12">
          <div className="border-l-2 border-accent pl-6">
            <h4 className="label text-accent">Engineering</h4>
            <p className="measure mt-3 text-body text-ink">
              {project.engineering}
            </p>
          </div>
        </Reveal>
      ) : null}

      {project.images[1] ? (
        <Reveal className="mt-12">
          <BrowserFrame image={project.images[1]} label={project.name} />
        </Reveal>
      ) : null}

      <Reveal className="mt-12">
        <div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          <div>
            <h4 className="label text-ink-muted">Frontend</h4>
            <div className="mt-3">
              <TagRow items={project.stack.frontend} />
            </div>
          </div>
          <div>
            <h4 className="label text-ink-muted">Backend</h4>
            <div className="mt-3">
              <TagRow items={project.stack.backend} />
            </div>
          </div>
          <div>
            <h4 className="label text-ink-muted">Infrastructure</h4>
            <div className="mt-3">
              <TagRow items={project.stack.infra} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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
          {project.links.liveNote ? (
            <p className="text-body-sm text-ink-muted">
              {project.links.liveNote}
            </p>
          ) : null}
        </div>
      </Reveal>
    </article>
  );
}
