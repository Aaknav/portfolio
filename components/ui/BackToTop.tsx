"use client";

import { useEffect, useState } from "react";

/**
 * Back-to-top control.
 *
 * Renders on the server in its hidden state and stays there until an effect
 * runs, so the server and client agree on the first paint. Scroll position is
 * something the server cannot know, and branching the tree on it would land us
 * back at the hydration mismatch this codebase has paid for once already.
 *
 * Visibility is toggled with utility classes rather than an inline style. That
 * is deliberate: e2e/settle.spec.ts fails any element carrying an inline
 * opacity below 1, and a permanently half-faded button would break the suite
 * for good.
 *
 * Focus moves to <main> after the scroll. Without it a keyboard user who
 * pressed this would be returned to the top of the page with their focus still
 * pinned to a control at the very bottom, and their next Tab would drop them
 * back down again.
 */

/* Roughly a screen and a half — far enough that the visitor has committed to
   reading, not so far that it only appears at the very end. */
const THRESHOLD_SCREENS = 1.5;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * THRESHOLD_SCREENS);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

        /* The attribute has to outlive the focus call: removing it straight
           away blurs the element and focus falls back to <body>, which is the
           bug this replaced. It is cleared on the way out instead. */
        const main = document.getElementById("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.addEventListener(
            "blur",
            () => main.removeAttribute("tabindex"),
            { once: true },
          );
          main.focus({ preventScroll: true });
        }
      }}
      className={`fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-md bg-accent text-accent-ink shadow-md transition-[opacity,transform,background-color] duration-200 hover:bg-accent-hover md:right-8 md:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 16 16"
        width="15"
        height="15"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8 13.5V3M8 3 3.5 7.5M8 3l4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}
