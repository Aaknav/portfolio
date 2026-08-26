/**
 * Single source of truth for identity, contact routes and navigation.
 *
 * The brand (Aaknav) carries the nav, page title and footer; the legal name
 * appears in About and in the Person structured data.
 */

export const site = {
  brand: "Aaknav",
  name: "Abhinav Bankar",
  role: "Full-Stack Developer",
  location: "Pune, India",

  /** Set once the domain is live — used for canonical URLs, OG tags, sitemap. */
  url: "https://aaknav.dev",

  email: "abhizbankar@gmail.com",
  github: "https://github.com/Aaknav",

  /**
   * Shown in the hero as a small availability dot.
   * Set to null to hide it entirely — never leave a stale "available" claim up.
   */
  availability: null as string | null,

  /**
   * Portrait for the About section. Set to null and the section drops the
   * figure cleanly rather than rendering a hole.
   *
   * `src` is a file in /public. The crop is deliberate: the frame is 4:5 and
   * the focal point sits at 35% from the top, which keeps a face centred with
   * the background still readable above it.
   */
  portrait: {
    src: "/abhinav-giza.jpg",
    alt: "Abhinav Bankar standing in front of the Great Pyramid of Giza",
    caption: "Giza, Egypt",
  } as { src: string; alt: string; caption: string } | null,

  title: "Aaknav — Full-Stack Developer for Business Websites & Software",
  description:
    "I build business websites and custom software — ticketing systems, dashboards, and internal tools — for small and medium businesses. Based in Pune.",
} as const;

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
] as const;

export const mailto = (subject = "Project enquiry") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
