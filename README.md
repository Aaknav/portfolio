# Aaknav — Portfolio

Client-acquisition site for **Abhinav Bankar**, full-stack developer (Pune, India),
trading as **Aaknav**. Built with Next.js (App Router) + Tailwind CSS, deployed on Vercel.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript 7 (strict) |
| Styling | Tailwind CSS 4 — CSS-first config, tokens in `app/globals.css` |
| Motion | Motion 13 (`motion/react`) |
| Fonts | Fraunces (display) · Geist Sans / Geist Mono — all self-hosted |
| Email | Resend, via a Server Action |
| Hosting | Vercel |

No database, no auth, no CMS, no state library. Every section is a Server
Component except the nav, the contact form, and the motion wrappers.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Environment

Copy `.env.example` to `.env.local` and fill in. The contact form is the only
thing that needs configuration — everything else is static.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it the form returns a graceful error pointing at the direct email address. |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered. Defaults to the address in `lib/site.ts`. |
| `CONTACT_FROM_EMAIL` | Verified Resend sender. Defaults to `enquiries@resend.dev` (fine for testing, replace for production). |

## Structure

```
app/
  layout.tsx           fonts, metadata, JSON-LD, skip link
  page.tsx             composes every section in order
  globals.css          design tokens + type scale
  opengraph-image.tsx  generated social card
  sitemap.ts robots.ts
components/
  layout/              Nav (client), Footer
  sections/            Hero, ProofStrip, Work, Services, Process,
                       About, TechStrip, FinalCTA, Contact, ContactForm
  work/                FeaturedProject (case study), ProjectCard (compact)
  ui/                  Button, TagChip, BrowserFrame, SectionHeading
  motion/              Reveal, HeroStagger — the only Motion imports
data/
  projects.ts          every project, one typed array
lib/
  site.ts              identity, nav links, contact routes
  actions.ts           contact Server Action (zod validation → Resend)
```

## Adding a project

Append an object to `projects` in `data/projects.ts`. Nothing else changes —
`featured: true` renders the full case-study layout, anything else renders as a
compact card. The layout is designed to hold from two projects to ten without
a redesign.

## Design system

Tokens live in `app/globals.css` and nothing else defines a colour. Light is
declared on `:root`; dark redefines only the values under
`prefers-color-scheme: dark`. Components are styled through the tokens, so a
theme change is a token change.

- **Type** — Fraunces for display only (never body), Geist Sans for text and UI,
  Geist Mono for labels and data chips.
- **Colour** — warm paper / warm near-black neutrals with a single copper
  accent. One accent, used thinly.
- **Radius** — 0 on chips, 6px on controls, 12px on cards. Nothing higher.
- **Motion** — hero entrance, one-shot section reveals, hover state changes.
  Everything collapses to an instant swap under `prefers-reduced-motion`.

## Before launch

- [ ] Replace pending screenshots in `public/work/` and drop `pending: true`
      in `data/projects.ts`
- [ ] Set `site.url` in `lib/site.ts` to the real domain
- [ ] Set `site.availability` if — and only if — it is currently true
- [ ] Configure Resend and send a real test enquiry
- [ ] Consider a branded contact address in place of the personal one
