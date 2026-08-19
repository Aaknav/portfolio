import { TagRow } from "@/components/ui/TagChip";

/**
 * Bridges hero → case study with one line of concrete evidence, so the
 * "can you actually build this?" question is answered continuously rather
 * than only once the visitor reaches the case study.
 */
export function ProofStrip() {
  return (
    <section className="border-y border-border bg-surface px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <p className="text-body-sm text-ink-muted">
          Currently shipping{" "}
          <span className="text-ink">Inventive Helpdesk</span> — a multi-tenant
          support platform in production.
        </p>
        <TagRow
          items={[
            "Next.js",
            "TypeScript",
            "Frappe / Python",
            "Supabase",
            "Socket.IO",
          ]}
        />
      </div>
    </section>
  );
}
