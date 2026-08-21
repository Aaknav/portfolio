# End-to-end tests

```bash
npm run test:e2e          # headless, all projects
npm run test:e2e:ui       # interactive runner, best for writing tests
npm run test:e2e:headed   # watch a real browser drive the site
npm run test:e2e:report   # open the last HTML report
npm run verify            # lint + typecheck + e2e, the full gate
```

The dev server starts automatically on port **3100**, so a `npm run dev` already
running on 3000 is left alone. Override with `PLAYWRIGHT_PORT`.

## What is covered

| File | Guards |
| --- | --- |
| `smoke.spec.ts` | routes return 200, titles, no console errors, robots + sitemap |
| `nav.spec.ts` | desktop links, mobile sheet focus trap, Escape, focus return |
| `contact.spec.ts` | validation messages, `aria-invalid` wiring, honeypot stays hidden |
| `a11y.spec.ts` | one `h1` per page, alt text, named regions, labelled controls |
| `axe.spec.ts` | full WCAG 2.1 A/AA rule sweep per route, plus the open mobile sheet |

## No test can send a real enquiry

`playwright.config.ts` starts the server with `RESEND_API_KEY` empty. The
contact action only reaches Resend after zod passes, and with no key it returns
an error before touching the network. Every case in `contact.spec.ts` fails
validation first anyway.

## Browsers

All four projects run: **chromium**, **firefox**, **webkit**, and **mobile**
(Pixel 7). System dependencies are installed machine-wide, so any other project
on this box gets the same engines without further setup.

If a future Playwright bump reports missing dependencies again:

```bash
sudo env "PATH=$PATH" npx playwright install-deps
```

The `sudo env "PATH=$PATH"` prefix matters — plain `sudo npx` fails because npx
lives in nvm and sudo resets PATH.

## Visual regression — deliberately not enabled yet

`expect.toHaveScreenshot` is configured, but there are no baseline snapshots on
purpose. Baselines generated on a dev machine bake in that machine's font
rendering and then diff forever against CI. This machine is missing
`Liberation Sans` and `Noto Color Emoji`, both of which ship in the official
Playwright image, so local baselines would be wrong from the first commit.

When visual coverage is wanted, generate baselines **only** inside the pinned
container so local and CI rendering are byte-identical:

```bash
docker run --rm -v "$(pwd)":/work -w /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  npx playwright test --update-snapshots
```

## Reduced motion is on for every test

`contextOptions.reducedMotion: "reduce"` is set globally. Two reasons:

1. `globals.css` uses `scroll-behavior: smooth`, so landing on `/#contact`
   animates the form across the viewport while a test tries to click it. That
   was a real source of cross-browser flake.
2. It exercises the accessible path, which is how the hydration bug in
   `Reveal`/`HeroStagger` was caught — those components used to branch on
   `useReducedMotion()` at render time, which the server cannot evaluate, so
   the client built a different DOM and React discarded the server HTML.

Motion preference is now applied globally in `components/motion/MotionProvider.tsx`.
Never branch the React tree on `useReducedMotion()` again — it will reintroduce
the same class of bug.

## Accessibility

Two layers, deliberately separate:

- `a11y.spec.ts` — structural invariants this site chose to guarantee (exactly
  one `h1`, alt on every image, every `aria-labelledby` resolving). Cheap, fast,
  and specific to how these pages are built.
- `axe.spec.ts` — `@axe-core/playwright` against the `wcag2a`, `wcag2aa`,
  `wcag21a` and `wcag21aa` tags, asserting zero violations. Held to tags rather
  than individual rule ids, so an axe release that tightens an existing WCAG
  rule is picked up instead of pinned out.

The open mobile sheet gets its own scan. It only exists after a click, and it is
where the focus trap and `aria-expanded` wiring live, so no route-level scan
reaches it. That test skips on the desktop projects and runs on `mobile`.

Turning axe on found two real defects, both since fixed: the `--accent` copper
failed AA contrast on every light ground (3.97:1 as text on tinted surfaces,
4.50:1 under white button text), and `Reveal` wrapped list items in a `motion.div`,
putting a `<div>` between `<ul>`/`<ol>` and its `<li>` children and stripping the
list semantics entirely. `Reveal` now takes `as="li"` for that case.
