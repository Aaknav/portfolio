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
 * `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=` and playwright.config.ts sets it to "", both of which
 * mean "not configured" — without this they would arrive as an empty string and
 * slip past a naive presence check.
 */
export const env = createEnv({
  server: {

    /* Injected by the platform, not configured by us: "1" on any Vercel build,
       absent everywhere else. Analytics reads it because its script is served
       from /_vercel/insights and only exists on a deployment — rendering the
       component locally 404s and fills the console, which the smoke suite
       (rightly) fails on. */
    VERCEL: z.string().optional(),

    /* "production" | "preview" | "development" on a Vercel build, absent
       locally. data/testimonials.ts uses it to keep placeholder quotes off the
       production site while leaving them visible in previews. */
    VERCEL_ENV: z.string().optional(),
  },

  client: {
    /* Public on purpose. Web3Forms sits behind Cloudflare, which answers a
       server-side POST with a challenge page, so the submission has to happen
       in the browser — and their documentation states the access key is safe to
       expose. A UUID; anything else is a paste error worth catching at boot. */
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z
      .string()
      .uuid("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY should be the UUID from web3forms.com")
      .optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY:
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },

  emptyStringAsUndefined: true,
});
