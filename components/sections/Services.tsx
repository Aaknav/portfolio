import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Editorial rows, not an icon-card grid — this reads as a considered menu
 * rather than a marketing template, and each row leads with the client
 * outcome rather than the technology.
 */
const services = [
  {
    name: "Business Websites",
    outcome:
      "Professional, fast-loading sites that establish credibility and generate enquiries.",
    examples: "Company sites · service-business sites · product marketing pages",
  },
  {
    name: "Custom Web Applications",
    outcome:
      "Software built around how your business actually works, not a generic template it has to bend around.",
    examples: "Booking flows · client portals · quoting tools",
  },
  {
    name: "Business Tools & Dashboards",
    outcome:
      "Ticketing and helpdesk systems, internal dashboards and workflow tools that replace a spreadsheet or a stack of tabs.",
    examples: "Support ticketing · ops dashboards · internal admin panels",
  },
  {
    name: "Ongoing Support & Maintenance",
    outcome:
      "Fixes, updates and improvements after launch — the relationship doesn’t end at deploy.",
    examples: "Bug fixes · small feature additions · dependency upgrades",
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t border-border px-6 py-14 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="What I can build for you"
          />
        </Reveal>

        <ul className="mt-14">
          {services.map((service, index) => (
            <Reveal
              key={service.name}
              delay={index * 0.05}
              as="li"
              className="group grid gap-3 border-t border-border py-8 transition-colors last:border-b md:grid-cols-[1fr_1.6fr] md:gap-12"
            >
              <h3 className="text-display-md transition-colors group-hover:text-accent">
                {service.name}
              </h3>
              <div>
                <p className="measure text-body text-ink-muted">
                  {service.outcome}
                </p>
                <p className="label mt-4 text-ink-muted">{service.examples}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
