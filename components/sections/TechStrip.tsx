import { Reveal } from "@/components/motion/Reveal";
import { TagRow } from "@/components/ui/TagChip";

/**
 * For the technical evaluator. Grouped plain text with no proficiency bars —
 * a percentage against a language name convinces nobody and dates instantly.
 */
const groups = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    name: "Backend",
    items: ["Python", "Frappe", "Node.js", "PostgreSQL", "MariaDB", "Supabase"],
  },
  {
    name: "Infrastructure",
    items: ["Docker", "GitHub Actions", "Vercel", "Redis", "Cloud Operations"],
  },
];

export function TechStrip() {
  return (
    <section
      aria-labelledby="tech-heading"
      className="border-t border-border bg-surface px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="tech-heading" className="label text-accent">
          What I work with
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {groups.map((group, index) => (
            <Reveal key={group.name} delay={index * 0.05}>
              <div>
                <h3 className="text-body text-ink">{group.name}</h3>
                <div className="mt-3">
                  <TagRow items={group.items} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
