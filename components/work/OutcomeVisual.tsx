/**
 * Miniature interface fragments for the outcome cards.
 *
 * Each one is a reduction of something the real product does, not a decorative
 * icon: a queue with ownership and status, a scoped client view, an inbound
 * email becoming a ticket. Drawn with tokens so both themes work.
 */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-20 flex-col justify-center gap-1.5 overflow-hidden rounded-md border border-border bg-surface-sunken px-3"
    >
      {children}
    </div>
  );
}

/** Three queued tickets: priority, id, owner, status. */
function QueueVisual() {
  const rows = [
    { tone: "bg-danger", w: "w-16", status: "w-8 border-accent/50" },
    { tone: "bg-accent", w: "w-20", status: "w-6 border-border-strong" },
    { tone: "bg-ink-muted", w: "w-12", status: "w-9 border-border-strong" },
  ];
  return (
    <Frame>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className={`size-1.5 shrink-0 rounded-full ${row.tone}`} />
          <span className={`h-1.5 rounded-full bg-border-strong ${row.w}`} />
          <span className="h-1.5 flex-1 rounded-full bg-border" />
          <span className={`h-3 shrink-0 rounded-[2px] border ${row.status}`} />
        </div>
      ))}
    </Frame>
  );
}

/** Two client lanes: each sees only its own rows; a third is withheld. */
function AccessVisual() {
  return (
    <Frame>
      <div className="flex items-center gap-2">
        <span className="label text-accent">A</span>
        <span className="h-1.5 w-10 rounded-full bg-accent/60" />
        <span className="h-1.5 w-14 rounded-full bg-accent/60" />
      </div>
      <div className="flex items-center gap-2">
        <span className="label text-ink-muted">B</span>
        <span className="h-1.5 w-16 rounded-full bg-border-strong" />
        <span className="h-1.5 w-8 rounded-full bg-border-strong" />
      </div>
      <div className="flex items-center gap-2 opacity-45">
        <span className="label text-ink-muted">·</span>
        <span className="h-1.5 w-12 rounded-full bg-border [mask-image:repeating-linear-gradient(90deg,#000_0_3px,transparent_3px_6px)]" />
        <span className="h-1.5 w-10 rounded-full bg-border [mask-image:repeating-linear-gradient(90deg,#000_0_3px,transparent_3px_6px)]" />
        <span className="label text-ink-muted">✕</span>
      </div>
    </Frame>
  );
}

/** An inbound email resolving into a ticket, then a live update. */
function SpeedVisual() {
  return (
    <Frame>
      <div className="flex items-center gap-2">
        <span className="label shrink-0 text-ink-muted">@</span>
        <span className="h-1.5 w-12 rounded-full bg-border-strong" />
        <span className="label shrink-0 text-accent">→</span>
        <span className="h-3 w-10 shrink-0 rounded-[2px] border border-accent/50" />
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="relative flex size-1.5 shrink-0">
          <span className="absolute inline-flex size-full rounded-full bg-accent/40" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        <span className="h-1.5 w-20 rounded-full bg-border" />
        <span className="h-1.5 flex-1 rounded-full bg-border" />
      </div>
    </Frame>
  );
}

export function OutcomeVisual({ kind }: { kind: "queue" | "access" | "speed" }) {
  if (kind === "queue") return <QueueVisual />;
  if (kind === "access") return <AccessVisual />;
  return <SpeedVisual />;
}
