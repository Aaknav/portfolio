import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The one section where numbered markers are earned — this is an actual
 * sequence, so 01–06 encodes something true rather than decorating a list.
 */
const steps = [
  {
    n: "01",
    name: "Discover",
    body: "A short call to understand the problem, not just the feature list — what’s actually costing you time or customers today.",
  },
  {
    n: "02",
    name: "Plan",
    body: "A concrete scope, timeline and cost before any code is written. No surprises mid-project.",
  },
  {
    n: "03",
    name: "Build",
    body: "Iterative development with regular check-ins — you see working software early, not just at the end.",
  },
  {
    n: "04",
    name: "Test",
    body: "Real testing against real use cases, not a demo that only works on the happy path.",
  },
  {
    n: "05",
    name: "Launch",
    body: "Deployed, configured and handed over cleanly — with documentation, not just a login.",
  },
  {
    n: "06",
    name: "Support",
    body: "Available after launch for fixes and follow-on work. The relationship doesn’t end at deploy.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-t border-border bg-surface px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="process-heading"
            eyebrow="Process"
            title="What happens after you get in touch"
            lede="No mystery, no black box. Here’s the sequence every project follows."
          />
        </Reveal>

        <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.n} delay={index * 0.05}>
              <li className="flex gap-5">
                <span className="label shrink-0 pt-1 text-accent tabular-nums">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-body-lg text-ink">{step.name}</h3>
                  <p className="mt-2 text-body-sm text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
