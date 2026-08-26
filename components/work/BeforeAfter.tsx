"use client";

import { motion } from "motion/react";
import type { Project } from "@/data/projects";

/**
 * The device the whole site rests on.
 *
 * Left is the disorder the client lived in: no saturation, dashed frames, each
 * scrap knocked a fraction off true. Right is what it became: a real surface,
 * ruled, aligned, and carrying the only saturated colour in the system.
 *
 * The entrance is the argument. Presenting both halves at once says the one
 * thing this design does not mean — that they coexist. So the left arrives
 * first, a hairline sweeps the seam, and the right stamps in after it, with the
 * status chips landing last because status is the payload and the eye should
 * finish on the thing that changed.
 *
 * Nothing here branches on the visitor's motion preference; MotionConfig in
 * MotionProvider does that globally. Under reduced motion, Motion drops the
 * transforms and keeps the opacity, so the rotation-settle and the seam sweep
 * disappear while the sequence survives — the argument still lands, the
 * movement does not. Every variant ends at opacity 1, which is what
 * e2e/settle.spec.ts requires and why nothing here loops or scrubs on scroll.
 *
 * The caption is not decoration and must not be removed. Both sides are
 * illustrations — the scraps stand in for a documented problem and the rows
 * reconstruct an interface whose real contents are client data.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* Resting angles live here rather than in Tailwind rotate classes: Motion owns
   the transform once it animates rotate, and a class would fight it. */
const REST_ANGLES = [-0.5, 0.4, -0.3];
const SCRAP_OFFSETS = ["mr-8", "ml-6", "mr-4"];

const orchestrate = { hidden: {}, shown: {} };

const scrapVariants = (rest: number) => ({
  hidden: { opacity: 0, y: -6, rotate: rest + 1.5 },
  shown: {
    opacity: 1,
    y: 0,
    rotate: rest,
    transition: { duration: 0.36, ease: EASE },
  },
});

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.36, duration: 0.24, ease: EASE },
  },
};

export function BeforeAfter({ project }: { project: Project }) {
  const { before, after } = project;
  if (!before?.length || !after?.length) return null;

  return (
    <figure className="flex flex-col gap-3">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-80px" }}
        variants={orchestrate}
        className="relative grid border border-border bg-border md:grid-cols-2 md:gap-px"
      >
        <motion.div
          variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-col gap-4 bg-bg p-6 md:p-8"
        >
          <p className="label text-before-ink">Before</p>
          <ul className="flex flex-col gap-2.5">
            {before.map((scrap, index) => (
              <motion.li
                key={scrap}
                variants={scrapVariants(REST_ANGLES[index] ?? 0)}
                className={`border border-dashed border-before-line px-3 py-2 text-body-sm text-before-ink ${SCRAP_OFFSETS[index] ?? ""}`}
              >
                {scrap}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* The seam, drawn once the left has landed. Two columns only — stacked
            on phones there is no seam to sweep. */}
        <motion.span
          aria-hidden="true"
          variants={{
            hidden: { scaleY: 0 },
            shown: {
              scaleY: 1,
              transition: { delay: 0.26, duration: 0.14, ease: "linear" },
            },
          }}
          style={{ originY: 0 }}
          className="absolute inset-y-0 left-1/2 hidden w-px bg-accent md:block"
        />

        <motion.div
          variants={{ shown: { transition: { delayChildren: 0.4, staggerChildren: 0.05 } } }}
          className="flex flex-col gap-4 bg-surface p-6 md:p-8"
        >
          <p className="label text-accent">After · {project.name}</p>
          <ul className="flex flex-col">
            {after.map((row) => (
              <motion.li
                key={row.item}
                variants={rowVariants}
                className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-body-sm last:border-b-0"
              >
                <span>{row.item}</span>
                <motion.span
                  variants={chipVariants}
                  className="label shrink-0 border border-accent px-1.5 py-0.5 text-accent"
                >
                  {row.state}
                </motion.span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <figcaption className="text-body-sm text-ink-muted">
        Illustration, not a screenshot
        {project.links.liveNote ? ` — ${project.links.liveNote.toLowerCase()}` : "."}
      </figcaption>
    </figure>
  );
}
