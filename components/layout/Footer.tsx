import { site } from "@/lib/site";

/**
 * The sign-off, and nothing else.
 *
 * The footer used to repeat the whole site: the same four nav links as the
 * header, and the same email and GitHub links as the Contact section directly
 * above it. Neither repetition earned its place — the header nav is sticky, so
 * it is on screen at the moment anyone would reach for a footer link, and a
 * visitor who has scrolled past the contact form has already been offered both
 * addresses at the point where they were deciding.
 *
 * The heart is decorative: it is hidden from assistive tech and the word it
 * stands for is read out instead, so the line is spoken as written rather than
 * as "black heart suit".
 */
export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
        <p className="text-body-sm text-ink-muted">
          Made with{" "}
          <span aria-hidden="true" className="text-accent">
            &#9829;
          </span>
          <span className="sr-only">love</span> by {site.brand}
        </p>
        <p className="text-body-sm text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
