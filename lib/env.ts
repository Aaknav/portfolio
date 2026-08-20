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
 * `RESEND_API_KEY=` and playwright.config.ts sets it to "", both of which mean
 * "not configured" — without this they would arrive as an empty string and slip
 * past a naive presence check.
 */
export const env = createEnv({
  server: {
    /* Resend issues keys prefixed `re_`; anything else is a paste error or a
       key from a different service, and is worth catching at boot. */
    RESEND_API_KEY: z
      .string()
      .startsWith("re_", "RESEND_API_KEY should start with 're_'")
      .optional(),

    /* A typo here silently routes enquiries into the void — the send succeeds
       and nobody ever receives it. Defaults to site.email when unset. */
    CONTACT_TO_EMAIL: z.email().optional(),

    /* Must be a verified sender in Resend. Defaults to enquiries@resend.dev. */
    CONTACT_FROM_EMAIL: z.email().optional(),
  },

  client: {},

  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  },

  emptyStringAsUndefined: true,
});
