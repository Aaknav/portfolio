import { featuredProjects, otherProjects } from "@/data/projects";
import { FeaturedProject } from "@/components/work/FeaturedProject";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="Selected work"
            title="Built and shipped"
            lede="Two systems in production — one that runs a company’s support operation, one that brings a business its customers."
          />
        </Reveal>

        <div className="mt-14 flex flex-col gap-20">
          {featuredProjects.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}

          {otherProjects.length > 0 ? (
            <div className="flex flex-col gap-20">
              {otherProjects.map((project) => (
                <Reveal key={project.slug}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
