import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { settleAnimations } from "./helpers";

/**
 * Real rule coverage, as opposed to the structural invariants in a11y.spec.ts.
 *
 * a11y.spec.ts asserts the things this site decided to guarantee (one h1, alt
 * on every image). axe asserts the things WCAG guarantees — contrast ratios,
 * ARIA validity, focus order, landmark nesting — which are not practical to
 * hand-write and are exactly what drifts during a redesign.
 */

const routes = ["/", "/work/inventive-helpdesk", "/work/bhumita-mehendi"];

/* The ruleset the site is held to. Tags, not individual rules, so a new axe
 * release tightening an existing WCAG rule is picked up rather than pinned out. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Renders violations as something readable in CI instead of a JSON dump. */
function format(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations
    .map((v) => {
      const nodes = v.nodes.map((n) => `      ${n.target.join(" ")}`).join("\n");
      return `  [${v.impact ?? "unknown"}] ${v.id} — ${v.help}\n${nodes}\n      ${v.helpUrl}`;
    })
    .join("\n\n");
}

for (const route of routes) {
  test(`${route} has no WCAG violations`, async ({ page }) => {
    await page.goto(route);
    await settleAnimations(page);

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(violations, `\n${format(violations)}\n`).toEqual([]);
  });
}

/*
 * The open mobile sheet is a DOM state no route-level scan reaches: it is
 * rendered only after a click, and it is where focus traps and aria-expanded
 * wiring actually live.
 */
test("the open mobile menu has no WCAG violations", async ({ page }) => {
  await page.goto("/");
  await settleAnimations(page);

  const trigger = page.getByRole("button", { name: /menu/i });
  test.skip(!(await trigger.isVisible()), "menu trigger is desktop-hidden here");

  await trigger.click();
  await settleAnimations(page);

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

  expect(violations, `\n${format(violations)}\n`).toEqual([]);
});
