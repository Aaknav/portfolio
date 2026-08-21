import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * ButtonLink branches on the href, and the external branch carries a security
 * contract: a new tab opened without `rel="noopener"` hands the destination a
 * live `window.opener` handle back to this page.
 */
describe("ButtonLink", () => {
  it("opens external links in a new tab with noopener", () => {
    render(<ButtonLink href="https://github.com/Aaknav">GitHub</ButtonLink>);
    const link = screen.getByRole("link", { name: "GitHub" });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("keeps internal links in the same tab for client-side navigation", () => {
    render(<ButtonLink href="/work/inventive-helpdesk">Case study</ButtonLink>);
    const link = screen.getByRole("link", { name: "Case study" });

    expect(link).toHaveAttribute("href", "/work/inventive-helpdesk");
    expect(link).not.toHaveAttribute("target");
  });

  it("treats in-page anchors as internal", () => {
    render(<ButtonLink href="#contact">Get in touch</ButtonLink>);

    expect(screen.getByRole("link", { name: "Get in touch" })).not.toHaveAttribute(
      "target",
    );
  });

  it("applies the requested variant and size", () => {
    render(
      <ButtonLink href="#contact" variant="secondary" size="lg">
        Get in touch
      </ButtonLink>,
    );

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveClass(
      "border",
      "h-12",
    );
  });
});

describe("Button", () => {
  it("forwards disabled to the underlying button", () => {
    render(<Button disabled>Send</Button>);

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("keeps a caller-supplied className alongside the variant classes", () => {
    render(<Button className="w-full">Send</Button>);

    expect(screen.getByRole("button", { name: "Send" })).toHaveClass(
      "w-full",
      "bg-accent",
    );
  });
});
