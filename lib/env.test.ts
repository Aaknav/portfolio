// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * These run in a node environment on purpose: @t3-oss/env-nextjs decides
 * server-vs-client by `typeof window`, and under jsdom it would classify this
 * as the browser and refuse to expose server variables at all.
 *
 * Validation happens once at import, so each case re-imports the module with a
 * different process.env.
 */
const KEYS = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;

async function loadEnv(vars: Partial<Record<(typeof KEYS)[number], string>>) {
  vi.resetModules();
  for (const key of KEYS) delete process.env[key];
  Object.assign(process.env, vars);
  return (await import("@/lib/env")).env;
}

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
  vi.restoreAllMocks();
});

/** t3-env logs the offending variables before throwing; keep output readable. */
const expectRejection = async (vars: Parameters<typeof loadEnv>[0]) => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  await expect(loadEnv(vars)).rejects.toThrow();
};

describe("optionality", () => {
  it("boots with nothing configured at all", async () => {
    const env = await loadEnv({});

    expect(env.RESEND_API_KEY).toBeUndefined();
    expect(env.CONTACT_TO_EMAIL).toBeUndefined();
  });

  it("treats the empty strings in .env.example as unset, not as values", async () => {
    const env = await loadEnv({
      RESEND_API_KEY: "",
      CONTACT_TO_EMAIL: "",
      CONTACT_FROM_EMAIL: "",
    });

    expect(env.RESEND_API_KEY).toBeUndefined();
    expect(env.CONTACT_TO_EMAIL).toBeUndefined();
    expect(env.CONTACT_FROM_EMAIL).toBeUndefined();
  });
});

describe("rejects misconfiguration", () => {
  it("rejects a key that is not a Resend key", async () => {
    await expectRejection({ RESEND_API_KEY: "sk_live_not_resend" });
  });

  it("rejects a malformed delivery address", async () => {
    await expectRejection({ CONTACT_TO_EMAIL: "abhiz@" });
  });

  it("rejects a malformed sender address", async () => {
    await expectRejection({ CONTACT_FROM_EMAIL: "noreply" });
  });
});

describe("accepts a valid configuration", () => {
  it("passes a complete, well-formed environment through", async () => {
    const env = await loadEnv({
      RESEND_API_KEY: "re_abc123",
      CONTACT_TO_EMAIL: "enquiries@aaknav.dev",
      CONTACT_FROM_EMAIL: "noreply@aaknav.dev",
    });

    expect(env.RESEND_API_KEY).toBe("re_abc123");
    expect(env.CONTACT_TO_EMAIL).toBe("enquiries@aaknav.dev");
    expect(env.CONTACT_FROM_EMAIL).toBe("noreply@aaknav.dev");
  });
});
