/**
 * Every project on the site, in one typed array.
 *
 * Adding a project is a data change, never a layout change: `featured: true`
 * renders through the full case-study layout, everything else through the
 * compact card grid. That grid reads as intentional at two projects and at ten.
 *
 * Rule for this file: only what is actually built and verifiable. No invented
 * metrics, clients, or outcomes.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  /** Shown in place of the image until a real screenshot is captured. */
  pending?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** One project carries the full case-study treatment. */
  featured: boolean;
  year: string;
  problem: string;
  solution: string;
  /** Only shipped functionality. */
  features?: string[];
  /** The "this is not just a frontend" paragraph. Optional by design. */
  engineering?: string;
  stack: {
    frontend: string[];
    backend: string[];
    infra: string[];
  };
  links: {
    live?: string;
    repo?: string;
    /** Why there is no public live link, when there isn't one. */
    liveNote?: string;
  };
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "inventive-helpdesk",
    name: "Inventive Helpdesk",
    tagline:
      "A multi-tenant support platform that replaced email threads and phone calls.",
    featured: true,
    year: "2026",
    problem:
      "Customer issues at Inventive Business Solutions arrived through email threads and phone calls — with no shared record of what was open, who owned it, or what had gone quiet. Support had to work across multiple clients, each with their own divisions, contacts and products, where a client may only ever see their own tickets and internal notes must never leak into a client-facing reply. Nothing off the shelf fit that shape cleanly.",
    solution:
      "A multi-tenant helpdesk on a Frappe (Python) backend with a Next.js frontend: tickets scoped to client and division, role-based access enforced in the permissions layer rather than hidden in the UI, inbound email turned automatically into tickets and replies, and live updates pushed to whoever is watching a ticket.",
    features: [
      "Full ticket lifecycle — typed Bug / Query / Improvement / New Feature, four priorities, and a New → Acknowledged → In Progress → Pending Client → Resolved → Closed flow with reopen",
      "A client-visible conversation thread kept structurally separate from internal work notes",
      "Attachments, collaborators, and a complete activity trail on every ticket",
      "Email intake — a client's reply becomes a ticket message automatically; unrecognised senders get their own numbering bucket",
      "Automatic client notification on client-facing status changes, plus a one-time first-response email",
      "Three access tiers — owner, manager, and client contact scoped to their own divisions — enforced server-side",
      "Realtime ticket updates over Socket.IO, scoped so only the ticket's owner, team and collaborators receive them",
      "An admin dashboard with KPI tiles, a created-vs-resolved time series, and breakdowns by status, priority, type and client",
      "Invite-based onboarding for staff and client contacts, with time-limited set-password links",
    ],
    engineering:
      "This is not a CRUD app with a login screen. Access control is enforced twice — once as query filters, so a client's ticket list can never return another client's rows, and again per document, so a client cannot reach a foreign ticket by guessing its ID. Internal work notes sit at a permission level clients are structurally incapable of reading, rather than being hidden by the interface. Ticket numbers are allocated through an atomic, transaction-safe counter instead of a max()+1 scan, so concurrent creation cannot collide. The backend carries 243 tests covering tenant isolation, reply threading, invite flows and permission edge cases, and ships with its own architecture reference and production runbooks.",
    stack: {
      frontend: ["Next.js", "React", "TypeScript", "Zustand", "Socket.IO"],
      backend: ["Frappe", "Python", "MariaDB", "Redis"],
      infra: ["Docker", "Portainer", "GitHub Actions", "GHCR"],
    },
    links: {
      repo: "https://github.com/inventive-business-solutions/inventive-helpdesk-backend",
      liveNote: "Production system — access is restricted to client accounts.",
    },
    images: [
      {
        src: "/work/helpdesk-dashboard.png",
        alt: "Inventive Helpdesk admin dashboard showing ticket KPI tiles, a created-versus-resolved time series, and breakdowns by status and priority",
        pending: true,
      },
      {
        src: "/work/helpdesk-ticket.png",
        alt: "A ticket detail view with the client-visible conversation separated from internal work notes",
        pending: true,
      },
    ],
  },
  {
    slug: "bhumita-mehendi",
    name: "Bhumita Mehendi",
    tagline:
      "A business website for a bridal mehendi artist — built so she can run it herself.",
    featured: false,
    year: "2026",
    problem:
      "A bridal and occasion mehendi artist in Nagpur needed a professional presence that brought in bookings — and needed to update it herself, without paying a developer every time a new design or testimonial was ready.",
    solution:
      "A fast marketing site with a private admin panel behind it. Designs, testimonials, services and site copy are all editable from the admin; WhatsApp, email and Instagram contact routes are wired straight into the calls to action, matched to how her clients actually reach her.",
    engineering:
      "The CMS is Supabase-backed with row-level security — the public can only ever read, and only the authenticated owner can write. Her own edits preview live over Realtime, uploads are compressed in the browser before they are stored, and if the database is ever unreachable the site falls back to bundled content rather than showing a broken page.",
    stack: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      backend: ["Supabase", "PostgreSQL", "Row-Level Security"],
      infra: ["Vercel"],
    },
    links: {
      live: "https://bhumitamehendi.com",
      repo: "https://github.com/Aabhinavbankar/Mehendi-Portfolio-Bhumita",
    },
    images: [
      {
        src: "/work/mehendi-home.png",
        alt: "Bhumita Mehendi homepage showing the gallery of henna designs",
        pending: true,
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
