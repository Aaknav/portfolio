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
const KEYS = ["WEB3FORMS_ACCESS_KEY"] as const;

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

    expect(env.WEB3FORMS_ACCESS_KEY).toBeUndefined();
  });

  it("treats the empty strings in .env.example as unset, not as values", async () => {
    const env = await loadEnv({ WEB3FORMS_ACCESS_KEY: "" });

    expect(env.WEB3FORMS_ACCESS_KEY).toBeUndefined();
  });
});

describe("rejects misconfiguration", () => {
  it("rejects a key that is not a UUID", async () => {
    await expectRejection({ WEB3FORMS_ACCESS_KEY: "not-a-uuid" });
  });

  it("rejects a Resend key pasted into the Web3Forms slot", async () => {
    await expectRejection({ WEB3FORMS_ACCESS_KEY: "re_abc123" });
  });
});

describe("accepts a valid configuration", () => {
  it("passes a well-formed access key through", async () => {
    const key = "3f1a2b4c-5d6e-4f70-8a91-b2c3d4e5f607";
    const env = await loadEnv({ WEB3FORMS_ACCESS_KEY: key });

    expect(env.WEB3FORMS_ACCESS_KEY).toBe(key);
  });
});
