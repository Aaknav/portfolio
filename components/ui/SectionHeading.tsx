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
    <div>
      <p className="label text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-display-md md:text-display-lg">
        {title}
      </h2>
      {lede ? (
        <p className="measure mt-4 text-body-lg text-ink-muted">{lede}</p>
      ) : null}
    </div>
  );
}
