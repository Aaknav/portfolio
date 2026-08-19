"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * One-shot section reveal: fade + a short rise as the element enters view.
 *
 * Fires once and never re-triggers on scroll-up — a section that re-animates
 * every time you pass it reads as a gimmick, not polish.
 *
 * Under prefers-reduced-motion the element renders in place with no transform
 * and no transition.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

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
