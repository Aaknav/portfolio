"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Applies the visitor's motion preference globally.
 *
 * `reducedMotion="user"` lets Motion honour prefers-reduced-motion *inside* the
 * library: transform and layout animations are dropped while opacity still
 * fades, which is the accessible behaviour — motion sickness comes from
 * movement, not from a fade.
 *
 * Doing it here rather than branching on `useReducedMotion()` inside each
 * component is what keeps SSR correct. The server cannot know the visitor's
 * preference, so any render-time branch on it makes the server and client
 * trees disagree and React throws out the server HTML (error #418).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
