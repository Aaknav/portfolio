import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects
      .filter((project) => project.caseStudy)
      .map((project) => ({
        url: `${site.url}/work/${project.slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.8,
      })),
  ];
}
