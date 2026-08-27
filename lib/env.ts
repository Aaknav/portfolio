import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validated environment. Import `env` instead of touching `process.env`.
 *
 * Every variable here is optional on purpose — the site is designed to run
 * without any of them, and the contact form degrades to "email me directly"
 * when there is no API key. What this guards is the other failure mode: a
 * variable that is *present but wrong*, which `process.env` reads back as a
 * perfectly good string and only fails in production at send time.
 *
 * `emptyStringAsUndefined` matters more than it looks. `.env.example` ships
 * `WEB3FORMS_ACCESS_KEY=` and playwright.config.ts sets it to "", both of which
 * mean "not configured" — without this they would arrive as an empty string and
 * slip past a naive presence check.
 */
export const env = createEnv({
  server: {
    /* Web3Forms delivers enquiries to the address the key was issued to, so
       there is no from/to address to configure and no domain to verify — which
       is the whole reason it is here rather than an email API. The key is a
       UUID; anything else is a paste error worth catching at boot. */
    WEB3FORMS_ACCESS_KEY: z
      .string()
      .uuid("WEB3FORMS_ACCESS_KEY should be the UUID from web3forms.com")
      .optional(),

    /* Injected by the platform, not configured by us: "1" on any Vercel build,
       absent everywhere else. Analytics reads it because its script is served
       from /_vercel/insights and only exists on a deployment — rendering the
       component locally 404s and fills the console, which the smoke suite
       (rightly) fails on. */
    VERCEL: z.string().optional(),
  },

  client: {},

  runtimeEnv: {
    WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
    VERCEL: process.env.VERCEL,
  },

  emptyStringAsUndefined: true,
});
