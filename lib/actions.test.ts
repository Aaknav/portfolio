import { beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";

/**
 * The contact action is the only place on the site where user input reaches a
 * third-party service, so every branch through it is worth pinning: what gets
 * rejected, what gets swallowed silently, and what actually sends.
 *
 * fetch is stubbed — these tests must never be one misconfigured env var away
 * from posting a real enquiry to Web3Forms.
 */
/*
 * `env` is validated once at module import, so vi.stubEnv after the fact never
 * reaches it. A hoisted mutable object lets each test choose what the action
 * sees while keeping the real validation in lib/env.ts under its own test.
 */
const envMock = vi.hoisted(() => ({
  WEB3FORMS_ACCESS_KEY: undefined as string | undefined,
}));
vi.mock("@/lib/env", () => ({ env: envMock }));

const send = vi.fn();
vi.stubGlobal("fetch", send);

/** Shapes a Web3Forms reply. */
const reply = (body: unknown, ok = true) => ({
  ok,
  status: ok ? 200 : 422,
  json: () => Promise.resolve(body),
});

import { submitContact } from "@/lib/actions";

/** A submission that passes validation; individual tests spoil one field. */
function formData(overrides: Record<string, string> = {}) {
  const fields: Record<string, string> = {
    name: "Priya Raman",
    email: "priya@example.com",
    projectType: "Internal tool",
    message:
      "We need a ticketing system for our support team of twelve people.",
    ...overrides,
  };

  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

const submit = (overrides?: Record<string, string>) =>
  submitContact({ status: "idle" }, formData(overrides));

/** The JSON body posted on the most recent send, typed for assertions. */
type SentPayload = Record<string, string>;
const lastPayload = () =>
  JSON.parse(
    (send.mock.calls.at(-1)?.[1] as { body: string }).body,
  ) as SentPayload;
const lastUrl = () => send.mock.calls.at(-1)?.[0] as string;

beforeEach(() => {
  vi.clearAllMocks();
  envMock.WEB3FORMS_ACCESS_KEY = "3f1a2b4c-5d6e-4f70-8a91-b2c3d4e5f607";
  send.mockResolvedValue(reply({ success: true }));
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
  it("falls back to a direct email address when the access key is missing", async () => {
    envMock.WEB3FORMS_ACCESS_KEY = undefined;

    const result = await submit();

    expect(result.status).toBe("error");
    expect(result.message).toContain(site.email);
    expect(send).not.toHaveBeenCalled();
  });

  it("posts to the Web3Forms endpoint from the server", async () => {
    await submit();

    expect(lastUrl()).toBe("https://api.web3forms.com/submit");
  });

  it("sets replyto to the enquirer so a reply reaches them", async () => {
    await submit({ email: "priya@example.com" });

    expect(lastPayload().replyto).toBe("priya@example.com");
  });

  it("sends the access key, never leaving it to the browser", async () => {
    await submit();

    expect(lastPayload().access_key).toBe(envMock.WEB3FORMS_ACCESS_KEY);
  });

  it("carries the submitted details into the payload", async () => {
    await submit({ company: "Northwind", budget: "₹2–4L" });

    const payload = lastPayload();
    expect(payload.subject).toContain("Priya Raman");
    expect(payload.Company).toBe("Northwind");
    expect(payload.Budget).toBe("₹2–4L");
    expect(payload.Message).toContain("ticketing system");
  });

  it("marks omitted optional fields rather than sending 'undefined'", async () => {
    await submit();

    const payload = lastPayload();
    expect(Object.values(payload)).not.toContain(undefined);
    expect(payload.Company).toBe("—");
    expect(payload.Timeline).toBe("—");
  });

  it("treats a success:false body as a failure even on a 200", async () => {
    send.mockResolvedValue(reply({ success: false, message: "invalid key" }));

    const result = await submit();

    expect(result.status).toBe("error");
    expect(result.message).toContain(site.email);
  });

  it("surfaces a non-ok response as an error state", async () => {
    send.mockResolvedValue(reply({ success: false }, false));

    const result = await submit();

    expect(result.status).toBe("error");
  });

  it("survives a body that is not JSON at all", async () => {
    send.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error("not json")),
    });

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
