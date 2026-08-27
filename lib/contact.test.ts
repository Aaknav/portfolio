import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEnquiry, validateEnquiry } from "@/lib/contact";

/**
 * Delivery happens in the browser now, so these run against a stubbed fetch.
 * The cases worth keeping are the ones that used to matter server-side: what is
 * rejected, what is silently swallowed, and what a Cloudflare challenge page
 * looks like coming back.
 */
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const reply = (body: unknown, ok = true) => ({
  ok,
  status: ok ? 200 : 403,
  /* Read as text, so a challenge page can be reported rather than discarded. */
  text: () => Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
});

const form = (overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    name: "Priya Raman",
    email: "priya@example.com",
    projectType: "Internal tool",
    message: "We need a ticketing system for our support team.",
    ...overrides,
  };
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.append(k, v);
  return data;
};

const KEY = "3f1a2b4c-5d6e-4f70-8a91-b2c3d4e5f607";

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockResolvedValue(reply({ success: true }));
});

describe("validateEnquiry", () => {
  it("rejects a blank name", () => {
    const result = validateEnquiry(form({ name: "   " }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBe("Enter your name");
  });

  it("rejects a malformed email", () => {
    const result = validateEnquiry(form({ email: "priya@" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBe("Enter a valid email address");
  });

  it("accepts a short message, since a short one is still an enquiry", () => {
    expect(validateEnquiry(form({ message: "call me" })).ok).toBe(true);
  });

  it("rejects an empty message", () => {
    const result = validateEnquiry(form({ message: "  " }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBe("Tell me what you need");
  });

  it("reports every invalid field at once, not just the first", () => {
    const result = validateEnquiry(form({ name: "", email: "nope", message: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["email", "message", "name"]);
    }
  });

  it("flags a filled honeypot as a trap rather than an error", () => {
    const result = validateEnquiry(form({ website: "https://spam.example" }));
    expect(result).toEqual({ ok: true, trap: true });
  });

  it("marks omitted optional fields rather than passing 'undefined' through", () => {
    const result = validateEnquiry(form());
    expect(result.ok && !result.trap && result.payload.Company).toBe("—");
    expect(result.ok && !result.trap && result.payload.Timeline).toBe("—");
  });

  it("sets replyto to the enquirer so a reply reaches them", () => {
    const result = validateEnquiry(form({ email: "priya@example.com" }));
    expect(result.ok && !result.trap && result.payload.replyto).toBe("priya@example.com");
  });
});

describe("sendEnquiry", () => {
  it("posts the access key with the payload", async () => {
    await sendEnquiry({ Name: "Priya" }, KEY);
    const [url, init] = fetchMock.mock.calls.at(-1) as [
      string,
      { body: FormData; headers: Record<string, string> },
    ];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(init.body.get("access_key")).toBe(KEY);
    expect(init.body.get("Name")).toBe("Priya");
  });

  /*
   * Pinning the transport, not the style: a JSON body sets a Content-Type that
   * is not CORS-safelisted, the browser preflights it, and Web3Forms does not
   * answer the preflight — so the request never leaves. Form data avoids that,
   * and only if the browser is left to set Content-Type itself.
   */
  it("sends form data and lets the browser set Content-Type", async () => {
    await sendEnquiry({ Name: "Priya" }, KEY);
    const [, init] = fetchMock.mock.calls.at(-1) as [
      string,
      { body: unknown; headers: Record<string, string> },
    ];
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("reports delivery on a success body", async () => {
    expect(await sendEnquiry({}, KEY)).toEqual({ delivered: true });
  });

  it("treats success:false on a 200 as a failure", async () => {
    fetchMock.mockResolvedValue(reply({ success: false, message: "invalid key" }));
    expect((await sendEnquiry({}, KEY)).delivered).toBe(false);
  });

  it("reports a Cloudflare challenge page instead of swallowing it", async () => {
    fetchMock.mockResolvedValue(reply("<!DOCTYPE html><title>Just a moment...</title>", false));
    const result = await sendEnquiry({}, KEY);
    expect(result.delivered).toBe(false);
    expect(result.reason).toContain("403");
    expect(result.reason).toContain("Just a moment");
  });

  it("survives a thrown network failure", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNRESET"));
    const result = await sendEnquiry({}, KEY);
    expect(result.delivered).toBe(false);
    expect(result.reason).toContain("ECONNRESET");
  });
});
