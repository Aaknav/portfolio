import Link from "next/link";
import { mailto, navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-body-lg">
            {site.brand}
          </p>
          <p className="mt-2 text-body-sm text-ink-muted">
            {site.role} · {site.location}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <a
            href={mailto()}
            className="text-body-sm text-ink-muted transition-colors hover:text-ink"
          >
            {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-ink-muted transition-colors hover:text-ink"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
        <p className="text-body-sm text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
