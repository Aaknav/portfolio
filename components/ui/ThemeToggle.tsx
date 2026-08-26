"use client";

/**
 * Theme switch.
 *
 * Renders identical markup on the server and the client, always. The icon is a
 * single half-filled disc meaning "switch" — never a sun-or-moon that reflects
 * the current theme, and never a label that names it. Anything state-dependent
 * would have to know the theme at render time, which the server cannot: that is
 * exactly the hydration mismatch (#418) this codebase already paid for once in
 * Reveal, and the reason MotionProvider exists.
 *
 * So the button carries no state at all. It reads the live theme at click time
 * and writes the opposite.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Switch between light and dark"
      title="Switch between light and dark"
      onClick={() => {
        const root = document.documentElement;
        const stamped = root.getAttribute("data-theme");
        const isDark = stamped
          ? stamped === "dark"
          : window.matchMedia("(prefers-color-scheme: dark)").matches;
        const next = isDark ? "light" : "dark";

        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem("aaknav-theme", next);
        } catch {
          /* Private mode or blocked storage — the choice just won't persist. */
        }
      }}
      className="flex size-10 items-center justify-center border border-border-strong text-ink transition-colors hover:border-ink"
    >
      <svg
        viewBox="0 0 20 20"
        width="17"
        height="17"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="10"
          cy="10"
          r="7.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 2.75a7.25 7.25 0 0 0 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
