/**
 * Interface reconstruction of the Inventive Helpdesk admin dashboard.
 *
 * Built from the real application: the status and priority values, the
 * ticket-numbering scheme ({client}-{division}-####, and INB- for senders
 * matching no registered contact), and the dashboard's own composition of
 * count tiles, a created-versus-resolved trend and the open queue.
 *
 * It renders live rather than as an image, so it stays sharp at any size and
 * adapts to the page theme. Client names are neutral stand-ins — no real client
 * data appears here. Replace with a real capture by dropping a file into
 * /public/work and removing `pending` in data/projects.ts.
 */

const tiles = [
  { label: "Open", value: "34", delta: "+6", tone: "neutral" as const },
  { label: "In progress", value: "12", delta: "+2", tone: "neutral" as const },
  { label: "Pending client", value: "7", delta: "−3", tone: "neutral" as const },
  { label: "Critical", value: "2", delta: "+1", tone: "danger" as const },
];

// Fourteen days of created (left bar) versus resolved (right bar).
const trend = [
  [5, 4], [7, 6], [4, 5], [8, 7], [6, 8], [9, 6], [5, 7],
  [7, 9], [10, 8], [6, 7], [8, 10], [7, 6], [9, 8], [6, 9],
];

const rows = [
  {
    id: "ACME-OPS-0142",
    title: "Export fails on large date ranges",
    type: "Bug",
    priority: "Critical",
    status: "In Progress",
  },
  {
    id: "ACME-FIN-0138",
    title: "Add quarterly summary to invoice view",
    type: "New Feature",
    priority: "Medium",
    status: "Acknowledged",
  },
  {
    id: "NORTH-WH-0091",
    title: "Stock count mismatch after sync",
    type: "Bug",
    priority: "High",
    status: "Pending Client",
  },
  {
    id: "NORTH-WH-0088",
    title: "Can we schedule the nightly report?",
    type: "Query",
    priority: "Low",
    status: "Resolved",
  },
  {
    id: "INB-0027",
    title: "Login link expired",
    type: "Query",
    priority: "Medium",
    status: "New",
  },
];

const statusTone: Record<string, string> = {
  "In Progress": "text-accent border-accent/40 bg-accent/10",
  Acknowledged: "text-ink-muted border-border-strong",
  "Pending Client": "text-ink-muted border-border-strong",
  Resolved: "text-success border-success/40 bg-success/10",
  New: "text-ink border-border-strong",
};

const priorityDot: Record<string, string> = {
  Critical: "bg-danger",
  High: "bg-accent",
  Medium: "bg-ink-muted",
  Low: "bg-border-strong",
};

const navItems = [
  "Dashboard",
  "Tickets",
  "Clients",
  "Contacts",
  "Team",
  "Products",
];

export function HelpdeskPreview() {
  const peak = Math.max(...trend.flat());

  return (
    <div
      role="img"
      aria-label="Inventive Helpdesk admin dashboard: ticket counts by status, a created-versus-resolved trend for the last fourteen days, and the open ticket queue with priority and status."
      className="flex min-h-[320px] bg-surface text-ink select-none"
    >
      {/* Sidebar */}
      <div className="hidden w-40 shrink-0 flex-col gap-1 border-r border-border p-4 sm:flex">
        <p className="label mb-3 text-accent">Helpdesk</p>
        {navItems.map((item, i) => (
          <span
            key={item}
            className={[
              "rounded-sm px-2 py-1.5 text-[0.7rem]",
              i === 0 ? "bg-accent/10 text-accent" : "text-ink-muted",
            ].join(" ")}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-[1.05rem]">
            Dashboard
          </p>
          <span className="label text-ink-muted">Last 14 days</span>
        </div>

        {/* Count tiles */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-md border border-border px-3 py-2.5"
            >
              <p className="label text-ink-muted">{tile.label}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span
                  className={[
                    "text-[1.4rem] leading-none tabular-nums",
                    tile.tone === "danger" ? "text-danger" : "text-ink",
                  ].join(" ")}
                >
                  {tile.value}
                </span>
                <span className="label text-ink-muted">{tile.delta}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          {/* Trend */}
          {/* Dropped on small screens: the tiles and the queue say more per
              pixel, and mobile should not scroll the desktop's content. */}
          <div className="hidden flex-col rounded-md border border-border p-3 md:flex">
            <p className="label text-ink-muted">Created vs resolved</p>
            {/* flex-1 so the plot fills whatever height the taller queue card
                sets for the row, instead of leaving dead space beneath it. */}
            <div className="mt-3 flex min-h-20 flex-1 items-end gap-[3px]">
              {trend.map(([created, resolved], i) => (
                // h-full matters: the bars below size in %, which resolves to
                // zero against an auto-height parent.
                <div key={i} className="flex h-full flex-1 items-end gap-[2px]">
                  <span
                    className="w-full rounded-t-[1px] bg-accent/70"
                    style={{ height: `${(created / peak) * 100}%` }}
                  />
                  <span
                    className="w-full rounded-t-[1px] bg-border-strong"
                    style={{ height: `${(resolved / peak) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4">
              <span className="label flex items-center gap-1.5 text-ink-muted">
                <span className="size-2 bg-accent/70" /> Created
              </span>
              <span className="label flex items-center gap-1.5 text-ink-muted">
                <span className="size-2 bg-border-strong" /> Resolved
              </span>
            </div>
          </div>

          {/* Queue */}
          <div className="min-w-0 rounded-md border border-border p-3">
            <p className="label text-ink-muted">Open queue</p>
            <div className="mt-2 flex flex-col">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 border-b border-border py-2 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 shrink-0 rounded-full ${priorityDot[row.priority]}`}
                  />
                  <span className="label hidden shrink-0 text-ink-muted md:inline">
                    {row.id}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.72rem] text-ink">
                    {row.title}
                  </span>
                  <span
                    className={`label hidden shrink-0 rounded-none border px-1.5 py-0.5 lg:inline ${statusTone[row.status]}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
