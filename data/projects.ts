/**
 * Every project on the site, in one typed array.
 *
 * The shape is split deliberately: the fields above `caseStudy` are what the
 * homepage shows — short, outcome-first, scannable. `caseStudy` holds the depth
 * and only ever renders on /work/[slug]. Homepage sells; the project page explains.
 *
 * Adding a project is a data change, never a layout change.
 *
 * Rule for this file: only what is actually built and verifiable. No invented
 * metrics, clients, or outcomes. Figures here were counted from the source, not
 * taken from its documentation — see `proofPoints` below.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  /**
   * No real screenshot yet. The homepage renders a built-from-source interface
   * reconstruction instead — never an empty frame. Drop a real capture into
   * /public/work and delete this flag to swap it in.
   */
  pending?: boolean;
};

export type Outcome = {
  title: string;
  body: string;
};

export type CaseStudySection = {
  heading: string;
  body: string;
  points?: string[];
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  /** One line, used on compact cards and as the case-study lede. */
  tagline: string;

  /** Homepage: the outcome headline, not a description of the software. */
  headline: string;
  /** Homepage: one sentence. Never a problem paragraph plus a solution paragraph. */
  summary: string;
  /** Homepage: exactly three, each readable in about two seconds. */
  outcomes?: Outcome[];
  /** Homepage: compact credibility strip. Verified claims only. */
  proofPoints?: string[];

  /**
   * The disorder this replaced, and what it became.
   *
   * These are illustrative of the problem each case study already documents —
   * a shared inbox, a spreadsheet, a DM thread — not transcriptions of real
   * client messages, and never a metric. The rule at the top of this file still
   * holds: nothing here is a claim about an outcome that was not delivered.
   */
  before?: string[];
  after?: { item: string; state: string }[];

  /**
   * For an owner-run site: the things that used to require a developer and now
   * do not. Every entry must be covered by the project's own summary — this is
   * a claim about who holds the keys, and it is checkable by asking the client.
   */
  handover?: string[];
  /** Homepage: four or five technologies, not a full inventory. */
  primaryStack: string[];

  featured: boolean;
  links: {
    live?: string;
    repo?: string;
    /** Why there is no public live link, when there isn't one. */
    liveNote?: string;
  };
  images: ProjectImage[];

  /** Everything below renders only on /work/[slug]. */
  caseStudy?: {
    problem: string;
    solution: string;
    fullStack: { frontend: string[]; backend: string[]; infra: string[] };
    sections: CaseStudySection[];
  };
};

export const projects: Project[] = [
  {
    slug: "inventive-helpdesk",
    name: "Inventive Helpdesk",
    year: "2026",
    tagline:
      "A multi-tenant support platform that replaced email threads and phone calls.",

    headline: "Support operations, in one secure workspace.",
    summary:
      "Replaced scattered email and phone support with a multi-tenant platform for tracking, ownership, and faster client communication.",

    outcomes: [
      {
        title: "One shared queue",
        body: "Ownership, priorities and ticket status in one place.",
      },
      {
        title: "Secure client access",
        body: "Each client sees only the work they are authorised to access.",
      },
      {
        title: "Faster support",
        body: "Email intake and real-time updates keep conversations moving.",
      },
    ],

    // Counted from source, not from the repo's own docs: 200 test methods in
    // tests/ plus 46 alongside the doctypes. ARCHITECTURE.md still says 243.
    proofPoints: [
      "Role-based access",
      "Email-to-ticket",
      "Real-time updates",
      "246 automated tests",
    ],

    before: [
      "Fwd: Re: Re: printer down again??",
      "missed call — 11:40 pm",
      "tracker_final_v3_USE THIS.xlsx",
    ],
    after: [
      { item: "Printer offline — Floor 2", state: "Owned" },
      { item: "New user access request", state: "Open" },
      { item: "Invoice export failing", state: "Resolved" },
    ],

    primaryStack: ["Next.js", "TypeScript", "Python", "Frappe", "MariaDB"],

    featured: true,
    links: {
      repo: "https://github.com/inventive-business-solutions/inventive-helpdesk-backend",
      liveNote: "Production system — access is restricted to client accounts.",
    },
    images: [
      {
        src: "/work/helpdesk-dashboard.png",
        alt: "Inventive Helpdesk admin dashboard showing ticket counts by status, a created-versus-resolved trend, and the open ticket queue",
        pending: true,
      },
    ],

    caseStudy: {
      problem:
        "Customer issues at Inventive Business Solutions arrived through email threads and phone calls — with no shared record of what was open, who owned it, or what had gone quiet. Support had to work across multiple clients, each with their own divisions, contacts and products, where a client may only ever see their own tickets and internal notes must never leak into a client-facing reply. Nothing off the shelf fit that shape cleanly.",
      solution:
        "A multi-tenant helpdesk on a Frappe (Python) backend with a Next.js frontend: tickets scoped to client and division, role-based access enforced in the permissions layer rather than hidden in the UI, inbound email turned automatically into tickets and replies, and live updates pushed to whoever is watching a ticket.",
      fullStack: {
        frontend: ["Next.js", "React", "TypeScript", "Zustand", "Socket.IO"],
        backend: ["Frappe", "Python", "MariaDB", "Redis"],
        infra: ["Docker", "Portainer", "GitHub Actions", "GHCR"],
      },
      sections: [
        {
          heading: "Multi-tenancy and permissions",
          body: "Access control is enforced twice, in the permissions layer rather than the interface. List queries are rewritten so a client's ticket list can never return another client's rows; per-document checks stop a client reaching a foreign ticket by guessing its ID. Internal work notes sit at a permission level client accounts are structurally incapable of reading.",
          points: [
            "Three tiers — owner, manager, and client contact scoped to their own divisions",
            "A contact's scope is a set of divisions, so an unscoped contact sees nothing rather than everything",
            "Write access to organisation records is gated separately from read access, so agents can read masters but not change them",
          ],
        },
        {
          heading: "Ticket lifecycle",
          body: "Tickets are typed Bug, Query, Improvement or New Feature, carry one of four priorities, and move through New → Acknowledged → In Progress → Pending Client → Resolved → Closed, with reopen. Every status, priority and assignment change is recorded as an activity entry.",
          points: [
            "A client-visible conversation thread kept structurally separate from internal work notes",
            "Attachments, collaborators and a complete activity trail on every ticket",
            "Ticket numbers allocated through an atomic, transaction-safe counter, so concurrent creation cannot collide",
          ],
        },
        {
          heading: "Email intake",
          body: "Inbound mail is polled and turned into tickets and replies automatically. A reply from a client's inbox threads back onto its original ticket; senders who match no registered contact are routed into their own numbering bucket so an unknown sender is never confused with a known client.",
          points: [
            "Clients are acknowledged automatically on ticket creation",
            "Client-facing status changes trigger a notification, and first response is emailed once and only once",
            "Outbound mail is logged separately from the framework's own queue, so delivery can still be answered for after that queue is purged",
          ],
        },
        {
          heading: "Real-time",
          body: "Ticket changes are pushed over Socket.IO to the ticket's owner, owning team and collaborators. Subscription runs through the same permission check as document access, so a client cannot subscribe to a ticket they may not read. List views receive a contentless ping rather than ticket data, so a refresh signal can fan out without leaking anything.",
        },
        {
          heading: "Onboarding and account security",
          body: "Staff and client contacts are both invited rather than self-registering. Invites provision an account, link it back to its directory record, and email a set-password link.",
          points: [
            "Invite and password-reset links carry different lifetimes, derived per key rather than shared",
            "A pre-flight check reports link validity without consuming it, so mail scanners cannot burn a link before the recipient clicks",
            "Revoking an account also clears any outstanding link, so an old invite cannot let a disabled user back in",
          ],
        },
        {
          heading: "Testing and delivery",
          body: "246 automated tests cover the parts most likely to fail silently: tenant isolation, per-division ticket numbering, reply threading, invite flows and set-password link states. One test walks the syntax tree of every module for a specific shadowing bug that type checking and linting both accept but which fails at runtime in front of a user.",
          points: [
            "Containerised builds published to a registry and released through a deployment webhook",
            "A health endpoint reports the running commit so a deploy can be verified rather than assumed",
            "Ships with its own architecture reference and production runbooks",
          ],
        },
      ],
    },
  },
  {
    slug: "bhumita-mehendi",
    name: "Bhumita Mehendi",
    year: "2026",
    tagline:
      "A business website for a bridal mehendi artist — built so she can run it herself.",

    headline: "A business website its owner can actually run.",
    summary:
      "A fast marketing site with a private admin panel behind it, so designs, testimonials and copy change without a developer.",

    primaryStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],


    handover: ["Gallery of designs", "Testimonials", "Page copy"],

    featured: false,
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

    caseStudy: {
      problem:
        "A bridal and occasion mehendi artist in Nagpur needed a professional presence that brought in bookings — and needed to update it herself, without paying a developer every time a new design or testimonial was ready.",
      solution:
        "A fast marketing site with a private admin panel behind it. Designs, testimonials, services and site copy are all editable from the admin; WhatsApp, email and Instagram contact routes are wired straight into the calls to action, matched to how her clients actually reach her.",
      fullStack: {
        frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        backend: ["Supabase", "PostgreSQL", "Row-Level Security"],
        infra: ["Vercel"],
      },
      sections: [
        {
          heading: "A CMS the owner can use",
          body: "Every piece of content on the public site — designs, testimonials, services, about copy, contact details and the hero photography — is editable from a private admin panel. Her own edits preview live as she makes them.",
          points: [
            "Row-level security: the public can only ever read, and only the authenticated owner can write",
            "Uploads are compressed in the browser before they are stored",
            "If the database is ever unreachable the site falls back to bundled content rather than showing a broken page",
          ],
        },
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
