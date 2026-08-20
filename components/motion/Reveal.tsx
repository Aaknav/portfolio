"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/*
 * The elements a Reveal is allowed to become. A Reveal placed directly inside a
 * <ul>/<ol> has to BE the <li> — wrapping the <li> in a motion.div puts a div
 * between the list and its items, which strips the list semantics entirely and
 * stops assistive tech announcing it as a list.
 */
const elements = { div: motion.div, li: motion.li } as const;

/**
 * One-shot section reveal: fade + a short rise as the element enters view.
 *
 * Fires once and never re-triggers on scroll-up — a section that re-animates
 * every time you pass it reads as a gimmick, not polish.
 *
 * Reduced motion is handled globally by MotionProvider, not branched on here.
 * The server cannot know the visitor's preference, so a render-time branch
 * would change the DOM structure at hydration and cost us the server HTML.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof elements;
}) {
  const Component = elements[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Hero-only entrance. The arrival moment belongs to the hero alone; everything
 * below the fold uses Reveal instead.
 */
export function HeroStagger({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
