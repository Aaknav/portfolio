"use server";

import { z } from "zod";
import { env } from "@/lib/env";
import { site } from "@/lib/site";

/**
 * Client-side validation is a convenience, not a guarantee — everything is
 * re-validated here before an email is sent.
 */
const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.email("Enter a valid email address").max(200),
  company: z.string().trim().max(120).optional(),
  projectType: z.string().trim().min(1, "Choose a project type").max(80),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Tell me what you need")
    .max(5000),
  /**
   * Honeypot: bots fill hidden fields, people don't.
   *
   * Deliberately permissive. Rejecting a filled honeypot here would return a
   * validation error against an invisible input — which tells a bot exactly
   * which field is the trap, and dead-ends any human whose autofill touched
   * it behind "Please check the fields below" with nothing visible to fix.
   * The silent bail happens after parsing instead.
   */
  website: z.string().optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    projectType: formData.get("projectType"),
    budget: formData.get("budget") || undefined,
    timeline: formData.get("timeline") || undefined,
    message: formData.get("message"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the fields below.",
      errors,
    };
  }

  const data = parsed.data;

  // Silently accept honeypot hits so bots get no signal.
  if (data.website) return { status: "success" };

  const accessKey = env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error(
      "WEB3FORMS_ACCESS_KEY is not set — enquiry was not delivered.",
    );
    return {
      status: "error",
      message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
    };
  }

  /*
   * Posted from the server, not the browser.
   *
   * Web3Forms is designed to be called straight from a static page, and the key
   * is safe to expose — but going through the Server Action keeps zod as the
   * only gate an enquiry passes, keeps the honeypot server-side where a bot
   * cannot read it, and means the browser never learns the endpoint. The trade
   * is one extra hop, which nobody will feel.
   *
   * It is here rather than an email API because delivery goes to the address
   * the key was issued to: no sender domain to own, no DNS to verify.
   */
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        /* Web3Forms is built for a browser POST and rejected a bare server-side
           one with a 403 and an HTML body. Sending the origin it expects is what
           gets the request past that check. */
        Origin: site.url,
        Referer: `${site.url}/`,
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry — ${data.projectType} — ${data.name}`,
        from_name: site.brand,
        /* So a reply in the mail client goes to the enquirer, not to nobody. */
        replyto: data.email,
        Name: data.name,
        Email: data.email,
        Company: data.company ?? "—",
        "Project type": data.projectType,
        Budget: data.budget ?? "—",
        Timeline: data.timeline ?? "—",
        Message: data.message,
      }),
    });

    /* Read as text first: a rejection at the edge comes back as HTML, and
       calling .json() on it threw the body away — which left the log saying
       only "403 null" and nothing about why. */
    const body = await response.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(body) as unknown;
    } catch {
      parsed = null;
    }

    const delivered =
      response.ok &&
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as { success?: unknown }).success === true;

    if (!delivered) {
      console.error(
        "Web3Forms rejected the enquiry:",
        response.status,
        body.slice(0, 300),
      );
      return {
        status: "error",
        message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
      };
    }

    return {
      status: "success",
      message: "Thanks — I'll get back to you within a couple of days.",
    };
  } catch (cause) {
    console.error("Failed to send enquiry:", cause);
    return {
      status: "error",
      message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
    };
  }
}
