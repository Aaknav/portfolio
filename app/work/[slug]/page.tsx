import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { TagRow } from "@/components/ui/TagChip";
import { ButtonLink } from "@/components/ui/Button";
import { HelpdeskPreview } from "@/components/work/HelpdeskPreview";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { projects, getProject } from "@/data/projects";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return projects
    .filter((p) => p.caseStudy)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name} — case study | ${site.brand}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.caseStudy) notFound();

  const { caseStudy } = project;
  const image = project.images[0];

  return (
    <>
      <Nav />
      <main id="main">
        <article className="px-6 pt-32 pb-24 md:pt-40">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/#work"
              className="label text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true">← </span>All work
            </Link>

            <p className="label mt-10 text-accent">
              {project.name} · {project.year}
            </p>
            <h1 className="mt-4 text-display-lg md:text-display-xl">
              {project.headline}
            </h1>
            <p className="measure mt-5 text-body-lg text-ink-muted">
              {project.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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

          {/* Product visual */}
          <div className="mx-auto mt-14 max-w-5xl">
            {image?.pending && project.slug === "inventive-helpdesk" ? (
              <>
                <figure className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <span className="flex gap-1.5" aria-hidden="true">
                      <span className="size-2.5 rounded-full bg-border" />
                      <span className="size-2.5 rounded-full bg-border" />
                      <span className="size-2.5 rounded-full bg-border" />
                    </span>
                    <span className="label ml-2 text-ink-muted">
                      {project.name}
                    </span>
                  </div>
                  <HelpdeskPreview />
                </figure>
                <p className="mt-3 text-body-sm text-ink-muted">
                  Interface representation — the production system is
                  client-access only.
                </p>
              </>
            ) : image ? (
              <BrowserFrame image={image} label={project.name} />
            ) : null}
          </div>

          {/* Problem and solution — the depth the homepage deliberately omits. */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="label text-accent">Problem</h2>
                <p className="mt-3 text-body text-ink-muted">
                  {caseStudy.problem}
                </p>
              </div>
              <div>
                <h2 className="label text-accent">Solution</h2>
                <p className="mt-3 text-body text-ink-muted">
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            <div className="mt-20 flex flex-col gap-16">
              {caseStudy.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-display-md">{section.heading}</h2>
                  <p className="measure mt-4 text-body text-ink-muted">
                    {section.body}
                  </p>
                  {section.points ? (
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-body-sm text-ink-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1 shrink-0 bg-accent"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {/* Full stack — the homepage only shows the headline technologies. */}
            <section className="mt-20 border-t border-border pt-10">
              <h2 className="text-display-md">Built with</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="label text-ink-muted">Frontend</h3>
                  <div className="mt-3">
                    <TagRow items={caseStudy.fullStack.frontend} />
                  </div>
                </div>
                <div>
                  <h3 className="label text-ink-muted">Backend</h3>
                  <div className="mt-3">
                    <TagRow items={caseStudy.fullStack.backend} />
                  </div>
                </div>
                <div>
                  <h3 className="label text-ink-muted">Infrastructure</h3>
                  <div className="mt-3">
                    <TagRow items={caseStudy.fullStack.infra} />
                  </div>
                </div>
              </div>
            </section>

            {/* Conversion */}
            <section className="mt-20 rounded-xl border border-border bg-surface p-8 md:p-10">
              <p className="font-display text-display-md">
                Need something like this built?
              </p>
              <p className="measure mt-3 text-body text-ink-muted">
                Tell me what you&rsquo;re trying to build — I&rsquo;ll tell you
                honestly whether I&rsquo;m the right fit.
              </p>
              <div className="mt-7">
                <ButtonLink href="/#contact" size="lg">
                  Start a project <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
