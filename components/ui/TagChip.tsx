import type { ReactNode } from "react";

/**
 * Square mono chip for tech marks and data labels. Deliberately unrounded —
 * the squareness is the technical signal, and no logos appear anywhere.
 */
export function TagChip({ children }: { children: ReactNode }) {
  return (
    <span className="label border border-border px-2 py-1 text-ink-muted">
      {children}
    </span>
  );
}

export function TagRow({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item}>
          <TagChip>{item}</TagChip>
        </li>
      ))}
    </ul>
  );
}
