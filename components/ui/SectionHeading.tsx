/**
 * Section intro: eyebrow, heading, optional lede.
 *
 * Centred on phones and left-aligned from md up. A narrow column with a ragged
 * left edge under a short eyebrow reads as unfinished; centred, the intro holds
 * its own block. Tabular content — queue rows, the handover table — stays
 * left-aligned at every width, because centring data destroys scanning.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="text-center md:text-left">
      <p className="label text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-display-md md:text-display-lg">
        {title}
      </h2>
      {lede ? (
        <p className="measure mx-auto mt-4 text-body-lg text-ink-muted md:mx-0">
          {lede}
        </p>
      ) : null}
    </div>
  );
}
