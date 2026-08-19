import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  return (
    <section className="border-t border-border bg-surface px-6 py-24 md:py-28">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-md md:text-display-lg">
            Let&rsquo;s build the thing your business is missing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink-muted">
            Whether it&rsquo;s the site that brings customers in or the system
            that keeps things moving once they&rsquo;re here.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="#contact" size="lg">
              Start a project <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
