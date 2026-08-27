/**
 * Scroll to an in-page target.
 *
 * Clicking a link whose href already matches the current URL is a no-op: the
 * router sees no navigation, so nothing scrolls. That made every anchor on this
 * site single-use — open the contact form once, scroll away, and the button did
 * nothing on the second press because the hash was still #contact.
 *
 * Handling it here rather than in each component keeps the nav links and the
 * buttons behaving identically. Returns false when the href is not an in-page
 * target, so the caller can leave normal navigation alone.
 */
export function scrollToHash(href: string): boolean {
  if (!href.startsWith("#")) return false;

  const target = document.querySelector(href);
  if (!target) return false;

  /* Read the preference at click time, never at render: the server cannot know
     it, and branching a tree on it is the hydration bug this codebase already
     paid for once. */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });

  /* Keep the address bar truthful without pushing a duplicate history entry —
     otherwise Back would step through the same anchor repeatedly. */
  history.replaceState(null, "", href);
  return true;
}
