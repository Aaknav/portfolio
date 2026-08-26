# Aaknav — Portfolio

Client-acquisition site for **Abhinav Bankar**, full-stack developer (Pune, India),
trading as **Aaknav**. Built with Next.js (App Router) + Tailwind CSS, deployed on Vercel.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript 6 (strict) — pinned to 6.0.x, see `eslint.config.mjs` |
| Styling | Tailwind CSS 4 — CSS-first config, tokens in `app/globals.css` |
| Motion | Motion 13 (`motion/react`) |
| Fonts | Bricolage Grotesque (display) · IBM Plex Sans / IBM Plex Mono — all self-hosted |
| Email | Resend, via a Server Action |
| Testing | Vitest + Testing Library · Playwright + axe-core |
| Hosting | Vercel |

No database, no auth, no CMS, no state library. Every section is a Server
Component except the nav, the contact form, and the motion wrappers.

## Run locally

Node 24.19.0 — `nvm use` picks it up from `.nvmrc`.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint 10, type-aware rules |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, one run |
| `npm run test:watch` | Vitest, watching |
| `npm run test:coverage` | Vitest with a v8 coverage report |
| `npm run test:e2e` | Playwright, four browsers |
| `npm run verify` | Everything above that gates a release |

## Testing

Two layers, split by what each can decide. Vitest covers anything that doesn't
need a browser — validation branches, data invariants, component branching.
Playwright covers real journeys, and runs against a **production build** rather
than `next dev`, so a build failure is caught by the same gate.

```bash
npx vitest run lib/actions.test.ts     # one file
npx vitest run -t "honeypot"           # one test by name
npx playwright test e2e/contact.spec.ts --project=chromium
npm run test:e2e:ui                    # interactive runner
npm run test:e2e:report                # open the last HTML report
```

Playwright builds and serves on port **3100**, so a `npm run dev` already running
on 3000 is left alone — override with `PLAYWRIGHT_PORT`. `RESEND_API_KEY` is
forced empty for the server under test, so no test can send a real enquiry.
Coverage, browsers, accessibility scans and the deliberate absence of visual
baselines are all documented in [`e2e/README.md`](e2e/README.md).

`lefthook` gates locally: ESLint and related unit tests on staged files plus a
project-wide typecheck before a commit, the full unit suite before a push. The
Playwright suite is CI-only — it builds the site and drives four browsers, which
does not belong in the pause after `git commit`. CI runs the cheap job first and
only then the browsers.

## Environment

Copy `.env.example` to `.env.local` and fill in. The contact form is the only
thing that needs configuration — everything else is static.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it the form returns a graceful error pointing at the direct email address. |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered. Defaults to the address in `lib/site.ts`. |
| `CONTACT_FROM_EMAIL` | Verified Resend sender. Defaults to `enquiries@resend.dev` (fine for testing, replace for production). |

Values are validated at startup by `lib/env.ts`, so a key from the wrong service
or a typo'd address fails immediately instead of at send time in production.
Import `env` from there rather than reading `process.env`.

## Structure

```
app/
  layout.tsx           fonts, metadata, JSON-LD, skip link
  page.tsx             composes every section in order
  work/[slug]/         case-study page, statically generated per project
  globals.css          design tokens + type scale
  opengraph-image.tsx  generated social card
  sitemap.ts robots.ts
components/
  layout/              Nav (client), Footer
  sections/            Hero, ProofStrip, Work, Services, Process,
                       About, TechStrip, FinalCTA, Contact, ContactForm
  work/                BeforeAfter (the diptych), OwnerHandover (who makes the
                       change), HelpdeskPreview (interface drawing)
  ui/                  Button, TagChip, BrowserFrame, SectionHeading, ThemeToggle
  motion/              MotionProvider (global reduced-motion config),
                       Reveal, HeroStagger — the only Motion imports
data/
  projects.ts          every project, one typed array
lib/
  site.ts              identity, nav links, contact routes
  env.ts               validated environment
  actions.ts           contact Server Action (zod validation → Resend)
e2e/                   Playwright specs, helpers, and their own README
```

`HelpdeskPreview` draws an interface in markup rather than shipping an image: it
stays sharp at any size, follows the theme, and carries no real client data.
Anywhere a reconstruction appears it is labelled as one — see `BeforeAfter`.

## Adding a project

Append an object to `projects` in `data/projects.ts`. Nothing else changes —
`featured: true` renders the full case-study layout, anything else renders as a
compact card, and a `caseStudy` block generates `/work/<slug>` along with its
sitemap entry. The layout is designed to hold from two projects to ten without
a redesign.

`data/projects.test.ts` pins the contracts the components rely on — unique
URL-safe slugs, every rendered field populated, alt text on every image — so a
malformed entry fails in milliseconds rather than as a broken card or a 404.

Only what is built and verifiable goes in this file. No invented metrics,
clients, or outcomes; figures are counted from the source rather than taken from
its documentation.

## Design system

Tokens live in `app/globals.css` and nothing else defines a colour. Light is
declared on `:root`; dark redefines only the values under
`prefers-color-scheme: dark`. Components are styled through the tokens, so a
theme change is a token change.

- **Type** — Bricolage Grotesque for statements only (never body), IBM Plex Sans
  for reading, IBM Plex Mono for labels, chips and tabular data.
- **Colour** — cool paper / deep slate neutrals split into two temperatures:
  the drained "before" greys and one electric blue for the "after". Blue is
  never decoration — if something is blue it is the result of the work. Text
  contrast is held by `axe.spec.ts`; `--border-strong` meets WCAG 1.4.11 by
  hand-computed measurement, since axe has no automated rule for it.
- **Radius** — 0 on chips, 6px on controls, 12px on cards. Nothing higher.
- **Theme** — light, dark, and the visitor's explicit choice. `ThemeToggle`
  stamps `data-theme` on the root; an inline script in `app/layout.tsx` applies a
  stored choice before first paint so the theme never flashes.
- **Motion** — hero entrance, one-shot section reveals, hover state changes.
  Reduced motion is applied globally in `components/motion/MotionProvider.tsx`;
  no component branches on the preference at render time, because the server
  cannot evaluate it and the trees would disagree at hydration.

## Before launch

- [ ] Drop real screenshots into `public/work/` and remove `pending: true`
      in `data/projects.ts`
- [ ] Set `site.url` in `lib/site.ts` to the real domain
- [ ] Set `site.availability` if — and only if — it is currently true
- [ ] Configure Resend and send a real test enquiry
- [ ] Consider a branded contact address in place of the personal one
