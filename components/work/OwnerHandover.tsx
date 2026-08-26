import type { Project } from "@/data/projects";

/**
 * The counterpart device to BeforeAfter, for a site whose point is independence
 * rather than order.
 *
 * A real <table>, not a styled list. This is tabular data — a row per thing
 * that changes, a column per state — and as a header div plus a <ul> a screen
 * reader heard "Gallery of designs, Developer, Owner" with nothing tying the
 * values to their columns, so it read as though both parties make the change.
 * The strike-through is decoration browsers never announce; the <th scope> is
 * what actually carries the before/after meaning, and <s> marks the old value
 * as no longer accurate rather than merely drawing a line through it.
 *
 * The live link is deliberately the loudest thing here — it is the one project
 * a visitor can inspect for themselves — but sized to its own content.
 */
export function OwnerHandover({ project }: { project: Project }) {
  const { handover, links } = project;
  if (!handover?.length) return null;

  const host = links.live?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="label px-5 py-3 font-normal text-ink-muted">
                What changes
              </th>
              <th scope="col" className="label w-28 px-2 py-3 font-normal text-ink-muted">
                Before
              </th>
              <th scope="col" className="label w-28 px-2 py-3 font-normal text-ink-muted">
                After
              </th>
            </tr>
          </thead>
          <tbody>
            {handover.map((item) => (
              <tr key={item} className="border-b border-border last:border-b-0">
                <th
                  scope="row"
                  className="px-5 py-3.5 text-body-sm font-normal text-ink"
                >
                  {item}
                </th>
                <td className="px-2 py-3.5">
                  <s className="label text-before-ink decoration-before-line">
                    Developer
                  </s>
                </td>
                <td className="label px-2 py-3.5 text-accent">Owner</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {links.live && host ? (
        <a
          href={links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 inline-flex w-fit flex-wrap items-baseline gap-x-4 gap-y-1 border border-border bg-surface px-5 py-3.5 transition-colors hover:border-accent"
        >
          <span className="label text-ink-muted">Live site</span>
          <span className="text-display-sm text-ink transition-colors group-hover:text-accent">
            {host}
          </span>
          <span
            aria-hidden="true"
            className="text-body text-accent transition-transform group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>
      ) : null}
    </div>
  );
}
