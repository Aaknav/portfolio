import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * The confirmation is the one part of this form with no server behind it and no
 * e2e coverage — the browser suite runs with no access key, so it can only ever
 * reach the failure path. It has already been lost once, silently, in a
 * refactor: submissions succeeded and the form simply cleared itself.
 */
const envMock = vi.hoisted(() => ({
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: "3f1a2b4c-5d6e-4f70-8a91-b2c3d4e5f607",
}));
vi.mock("@/lib/env", () => ({ env: envMock }));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { ContactForm } from "@/components/sections/ContactForm";

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Name"), "Priya Raman");
  await user.type(screen.getByLabelText("Email"), "priya@example.com");
  await user.type(
    screen.getByLabelText("What are you trying to build?"),
    "We need a ticketing system.",
  );
  await user.click(screen.getByRole("button", { name: "Send enquiry" }));
};

beforeEach(() => {
  vi.clearAllMocks();
  envMock.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY = "3f1a2b4c-5d6e-4f70-8a91-b2c3d4e5f607";
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify({ success: true })),
  });
});

describe("after a successful send", () => {
  it("confirms it, rather than clearing the form silently", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);

    expect(await screen.findByRole("status")).toHaveTextContent(
      /that reached me/i,
    );
  });

  it("offers a way back to the form", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);

    await user.click(await screen.findByRole("button", { name: "Send another" }));
    expect(screen.getByRole("button", { name: "Send enquiry" })).toBeVisible();
  });
});

describe("when it fails", () => {
  it("says so and keeps the form on screen", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve("<html>blocked</html>"),
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);

    expect(await screen.findByText(/Something went wrong sending that/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Send enquiry" })).toBeVisible();
  });
});
