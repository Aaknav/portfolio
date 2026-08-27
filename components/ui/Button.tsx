"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { scrollToHash } from "@/lib/scroll";

type Variant = "primary" | "secondary" | "inverse";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold " +
  "transition-[color,background-color,border-color,opacity] duration-150 " +
  "disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary:
    "border border-border-strong text-ink hover:border-accent hover:text-accent bg-transparent",
  /* For use on an accent ground. This has to be a variant rather than a
     className override: passing colour utilities alongside `primary` leaves two
     competing `text-*` rules, and Tailwind settles that by stylesheet order,
     not by the order they appear in the attribute — which rendered the label in
     the button's own background colour and made it invisible. */
  /* The global :focus-visible ring is drawn in --accent, which on an accent
     ground is the panel's own colour — a 1:1 ring nobody can see. This variant
     is the one place that happens, so it carries its own. */
  inverse:
    "bg-accent-ink text-accent hover:opacity-90 focus-visible:outline-accent-ink",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-body-sm",
  lg: "h-12 px-6 text-body",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes(variant, size, className)}
      >
        {children}
      </a>
    );
  }

  const { onClick, ...linkProps } = rest;

  return (
    <Link
      href={href}
      className={classes(variant, size, className)}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        /* An anchor to the page you are already on does not navigate, so
           nothing scrolls. See lib/scroll.ts. */
        if (!event.defaultPrevented && scrollToHash(href)) {
          event.preventDefault();
        }
      }}
      {...linkProps}
    >
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
