"use server";

import { z } from "zod";
import { Resend } from "resend";
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
    .min(20, "Tell me a little more — 20 characters or so")
    .max(5000),
  /** Honeypot: bots fill hidden fields, people don't. */
  website: z.string().max(0).optional(),
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
    return { status: "error", message: "Please check the fields below.", errors };
  }

  const data = parsed.data;

  // Silently accept honeypot hits so bots get no signal.
  if (data.website) return { status: "success" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — enquiry was not delivered.");
    return {
      status: "error",
      message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "enquiries@resend.dev",
      to: process.env.CONTACT_TO_EMAIL ?? site.email,
      replyTo: data.email,
      subject: `New enquiry — ${data.projectType} — ${data.name}`,
      text: [
        `Name:      ${data.name}`,
        `Email:     ${data.email}`,
        `Company:   ${data.company ?? "—"}`,
        `Type:      ${data.projectType}`,
        `Budget:    ${data.budget ?? "—"}`,
        `Timeline:  ${data.timeline ?? "—"}`,
        "",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend rejected the enquiry:", error);
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
