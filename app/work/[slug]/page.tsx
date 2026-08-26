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
        {/*
          A spec sheet, not an essay.

          This page used to stack six heading-paragraph-bullets blocks down a
          single column, which is the shape of a blog post: nothing to scan, no
          way in except reading top to bottom. The depth is worth keeping — it is
          the whole reason the page exists — so the fix is structure rather than
          cuts. Facts come before prose, the problem and solution are stated in
          the site's own before/after language, and each section puts its
          heading in a rail with its evidence as ruled rows beside it.
        */}
        <article className="px-6 pt-28 pb-24 md:pt-36">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/#work"
              className="label text-ink-muted transition-colors hover:text-ink"
            >
              <span aria-hidden="true">← </span>All work
            </Link>

            <p className="label mt-10 text-accent">
              {project.name} · {project.year}
            </p>
            <h1 className="mt-4 max-w-[20ch] text-display-lg md:text-display-xl">
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

            {/* Facts before prose. proofPoints are the verified claims already
                carried by the data — the homepage stopped rendering them when
                the hero changed, and this is where they belong anyway. */}
            {project.proofPoints?.length ? (
              <ul className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {project.proofPoints.map((point) => (
                  <li key={point} className="bg-bg p-5">
                    <span className="label text-ink">{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            {image?.pending && project.slug === "inventive-helpdesk" ? (
              <figure className="flex flex-col gap-3">
                <div className="overflow-hidden border border-border bg-surface">
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
                </div>
                <figcaption className="text-body-sm text-ink-muted">
                  Interface representation — the production system is
                  client-access only.
                </figcaption>
              </figure>
            ) : image ? (
              <BrowserFrame image={image} label={project.name} />
            ) : null}
          </div>

          {/* Problem and solution in the site's own device: drained left,
              accent right. Two plain paragraphs said the same thing without
              showing that one replaced the other. */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-px border border-border bg-border md:grid-cols-2">
              <div className="flex flex-col gap-3 bg-bg p-6 md:p-8">
                <h2 className="label text-before-ink">The problem</h2>
                <p className="text-body text-before-ink">{caseStudy.problem}</p>
              </div>
              <div className="flex flex-col gap-3 bg-surface p-6 md:p-8">
                <h2 className="label text-accent">What replaced it</h2>
                <p className="text-body text-ink">{caseStudy.solution}</p>
              </div>
            </div>
          </div>

          {/* Each section: heading in a rail, evidence as ruled rows. */}
          <div className="mx-auto mt-20 max-w-5xl">
            <h2 className="label text-ink-muted">Inside the build</h2>

            <div className="mt-6 flex flex-col">
              {caseStudy.sections.map((section) => (
                <section
                  key={section.heading}
                  className="grid gap-4 border-t border-border py-8 last:border-b md:grid-cols-[14rem_1fr] md:gap-10 md:py-10"
                >
                  <h3 className="text-display-sm md:sticky md:top-24 md:self-start">
                    {section.heading}
                  </h3>

                  <div className="flex flex-col gap-5">
                    <p className="measure text-body text-ink">
                      {section.body}
                    </p>

                    {section.points ? (
                      <ul className="flex flex-col border-t border-border">
                        {section.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 border-b border-border py-3 text-body-sm text-ink-muted"
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
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Built with — the homepage only shows the headline technologies. */}
          <div className="mx-auto mt-20 max-w-5xl">
            <h2 className="label text-ink-muted">Built with</h2>
            <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-3">
              {(
                [
                  ["Frontend", caseStudy.fullStack.frontend],
                  ["Backend", caseStudy.fullStack.backend],
                  ["Infrastructure", caseStudy.fullStack.infra],
                ] as const
              ).map(([layer, items]) => (
                <div key={layer} className="flex flex-col gap-3 bg-bg p-5">
                  <h3 className="label text-ink-muted">{layer}</h3>
                  <TagRow items={items} />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            {/* The site rations its one saturated colour, which keeps it
                meaningful and leaves the page close to monochrome. This is the
                single place it gets a whole panel: the end of the longest read,
                where a colour change is a welcome full stop and there is no
                form whose legibility it could cost. */}
            <section className="flex flex-col gap-4 bg-accent p-8 text-accent-ink md:p-10">
              <p className="text-display-md">Need something like this built?</p>
              <p className="measure text-body opacity-90">
                Tell me what you&rsquo;re trying to build — I&rsquo;ll tell you
                honestly whether I&rsquo;m the right fit.
              </p>
              <div className="mt-3">
                <ButtonLink
                  href="/#contact"
                  size="lg"
                  className="bg-accent-ink text-accent hover:bg-accent-ink hover:opacity-90"
                >
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
