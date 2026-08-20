import { beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";

/**
 * The contact action is the only place on the site where user input reaches a
 * third-party service, so every branch through it is worth pinning: what gets
 * rejected, what gets swallowed silently, and what actually sends.
 *
 * Resend is mocked at the module boundary — these tests must never be one
 * misconfigured env var away from emailing a real inbox.
 */
/*
 * `env` is validated once at module import, so vi.stubEnv after the fact never
 * reaches it. A hoisted mutable object lets each test choose what the action
 * sees while keeping the real validation in lib/env.ts under its own test.
 */
const envMock = vi.hoisted(() => ({
  RESEND_API_KEY: undefined as string | undefined,
  CONTACT_TO_EMAIL: undefined as string | undefined,
  CONTACT_FROM_EMAIL: undefined as string | undefined,
}));
vi.mock("@/lib/env", () => ({ env: envMock }));

const send = vi.fn();
vi.mock("resend", () => ({
  /* Called with `new`, so this has to be a real function, not an arrow. */
  Resend: vi.fn(function Resend() {
    return { emails: { send } };
  }),
}));

import { submitContact } from "@/lib/actions";

/** A submission that passes validation; individual tests spoil one field. */
function formData(overrides: Record<string, string> = {}) {
  const fields: Record<string, string> = {
    name: "Priya Raman",
    email: "priya@example.com",
    projectType: "Internal tool",
    message: "We need a ticketing system for our support team of twelve people.",
    ...overrides,
  };

  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

const submit = (overrides?: Record<string, string>) =>
  submitContact({ status: "idle" }, formData(overrides));

/** The payload handed to Resend on the most recent send, typed for assertions. */
type SentEmail = { from: string; to: string; replyTo: string; subject: string; text: string };
const lastEmail = () => send.mock.calls.at(-1)?.[0] as SentEmail;

beforeEach(() => {
  vi.clearAllMocks();
  envMock.RESEND_API_KEY = "re_test_key";
  envMock.CONTACT_TO_EMAIL = undefined;
  envMock.CONTACT_FROM_EMAIL = undefined;
  send.mockResolvedValue({ error: null });
  /* The action logs failures deliberately; keep the test output readable. */
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("validation", () => {
  it("rejects a blank name", async () => {
    const result = await submit({ name: "   " });

    expect(result.status).toBe("error");
    expect(result.errors?.name).toBe("Enter your name");
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const result = await submit({ email: "priya@" });

    expect(result.errors?.email).toBe("Enter a valid email address");
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a message under 20 characters", async () => {
    const result = await submit({ message: "call me" });

    expect(result.errors?.message).toMatch(/20 characters/);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports every invalid field at once, not just the first", async () => {
    const result = await submit({ name: "", email: "nope", message: "hi" });

    expect(Object.keys(result.errors ?? {}).sort()).toEqual([
      "email",
      "message",
      "name",
    ]);
  });

  it("accepts a submission with the optional fields omitted", async () => {
    const result = await submit();

    expect(result.status).toBe("success");
    expect(send).toHaveBeenCalledOnce();
  });
});

describe("honeypot", () => {
  it("reports success to a bot but sends nothing", async () => {
    const result = await submit({ website: "https://spam.example" });

    expect(result.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });
});

describe("delivery", () => {
  it("falls back to a direct email address when the API key is missing", async () => {
    envMock.RESEND_API_KEY = undefined;

    const result = await submit();

    expect(result.status).toBe("error");
    expect(result.message).toContain(site.email);
    expect(send).not.toHaveBeenCalled();
  });

  it("sets replyTo to the enquirer so a reply reaches them, not Resend", async () => {
    await submit({ email: "priya@example.com" });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: "priya@example.com" }),
    );
  });

  it("carries the submitted details into the email body", async () => {
    await submit({ company: "Northwind", budget: "₹2–4L" });

    const { text, subject } = lastEmail();
    expect(subject).toContain("Priya Raman");
    expect(text).toContain("Northwind");
    expect(text).toContain("₹2–4L");
    expect(text).toContain("ticketing system");
  });

  it("marks omitted optional fields rather than printing 'undefined'", async () => {
    await submit();

    const { text } = lastEmail();
    expect(text).not.toContain("undefined");
    expect(text).toContain("Company:   —");
  });

  it("routes to the configured addresses when they are set", async () => {
    envMock.CONTACT_TO_EMAIL = "enquiries@aaknav.dev";
    envMock.CONTACT_FROM_EMAIL = "noreply@aaknav.dev";

    await submit();

    expect(lastEmail().to).toBe("enquiries@aaknav.dev");
    expect(lastEmail().from).toBe("noreply@aaknav.dev");
  });

  it("falls back to the site address when no recipient is configured", async () => {
    await submit();

    expect(lastEmail().to).toBe(site.email);
    expect(lastEmail().from).toBe("enquiries@resend.dev");
  });

  it("surfaces a rejection from Resend as an error state", async () => {
    send.mockResolvedValue({ error: { message: "rate limited" } });

    const result = await submit();

    expect(result.status).toBe("error");
    expect(result.message).toContain(site.email);
  });

  it("surfaces a thrown network failure as an error state", async () => {
    send.mockRejectedValue(new Error("ECONNRESET"));

    const result = await submit();

    expect(result.status).toBe("error");
    expect(result.message).toContain(site.email);
  });
});
