import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroStagger } from "@/components/motion/Reveal";

/**
 * One sentence, one button, and the objection handled underneath it.
 *
 * The previous hero opened with a diptych of a client's mess — a good argument
 * for a design-led site, and the wrong opening for a business owner deciding
 * whether to trust a stranger with money. They want to know what you do, what
 * it costs them to ask, and where to click. The three cards say what they can
 * buy without making them scroll to find out.
 *
 * "No obligation" and the reply window are doing the real work here. The fear
 * is not the price, it is being pulled into a sales call.
 */
const offers = [
  {
    name: "Websites",
    body: "Fast, credible, and easy for you to update yourself.",
  },
  {
    name: "Business tools",
    body: "Ticketing, dashboards and internal tools that replace a spreadsheet and a stack of tabs.",
  },
  {
    name: "Ongoing support",
    body: "I stay available after launch for fixes and follow-on work.",
  },
];

export function Hero() {
  return (
    <section className="px-6 pt-20 pb-14 md:pt-32 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <HeroStagger index={0}>
          <p className="label text-accent">Full-stack developer · {site.location}</p>
        </HeroStagger>

        <HeroStagger index={1}>
          <h1 className="mt-5 max-w-[18ch] text-[2.125rem] leading-[1.12] md:text-display-xl">
            Software that runs your business, built by one person.
          </h1>
        </HeroStagger>

        <HeroStagger index={2}>
          <p className="measure mt-5 text-body-lg text-ink-muted">
            Websites, booking systems, ticketing tools and dashboards for small
            businesses — designed, built and looked after by me.
          </p>
        </HeroStagger>

        <HeroStagger index={3}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#contact" size="lg">
              Get a free quote
            </ButtonLink>
            <ButtonLink href="#work" variant="secondary" size="lg">
              See my work
            </ButtonLink>
          </div>
        </HeroStagger>

        <HeroStagger index={4}>
          <p className="mt-5 text-body-sm text-ink-muted">
            Reply within two days · No obligation · One project at a time
          </p>
        </HeroStagger>

        <HeroStagger index={5}>
          <ul className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
            {offers.map((offer) => (
              <li
                key={offer.name}
                className="rounded-xl bg-surface p-5 md:p-6"
              >
                <p className="text-body font-semibold text-ink">{offer.name}</p>
                <p className="mt-1.5 text-body-sm text-ink-muted">{offer.body}</p>
              </li>
            ))}
          </ul>
        </HeroStagger>
      </div>
    </section>
  );
}
