import { z } from "zod";

/**
 * Everything the contact form needs, behind two functions.
 *
 * This runs in the browser rather than in a Server Action, and not by choice:
 * Web3Forms sits behind Cloudflare, which answers a server-side POST with a
 * "Just a moment..." challenge page and a 403. A browser can satisfy that
 * challenge; a serverless function cannot. Their own documentation assumes a
 * browser submission and states the access key is safe to expose, which is why
 * it moves to a NEXT_PUBLIC_ variable.
 *
 * Validation stays in one place and keeps its own tests. What it no longer is
 * is a *gate* — with delivery happening client-side, nothing server-side can
 * enforce it. Worth being honest about rather than implying a guarantee that is
 * not there: the schema is here to give people good errors, and the honeypot to
 * make the cheap bots go away.
 */
const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.email("Enter a valid email address").max(200),
  company: z.string().trim().max(120).optional(),
  projectType: z.string().trim().min(1, "Choose a project type").max(80),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "Tell me what you need").max(4000),
  /* Parsed permissively so a bot learns nothing from being rejected. */
  website: z.string().optional(),
});

export type Enquiry = z.infer<typeof schema>;
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export type Validated =
  | { ok: false; errors: EnquiryErrors }
  /* `trap` means the honeypot was filled: report success, send nothing. */
  | { ok: true; trap: true }
  | { ok: true; trap: false; payload: Record<string, string> };

export function validateEnquiry(formData: FormData): Validated {
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
    const errors: EnquiryErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof Enquiry | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { ok: false, errors };
  }

  const data = parsed.data;
  if (data.website) return { ok: true, trap: true };

  return {
    ok: true,
    trap: false,
    payload: {
      subject: `New enquiry — ${data.projectType} — ${data.name}`,
      /* So a reply in the mail client reaches the enquirer, not nobody. */
      replyto: data.email,
      Name: data.name,
      Email: data.email,
      Company: data.company ?? "—",
      "Project type": data.projectType,
      Budget: data.budget ?? "—",
      Timeline: data.timeline ?? "—",
      Message: data.message,
    },
  };
}

/**
 * Posts to Web3Forms and says only whether it arrived.
 *
 * A rejection at Cloudflare comes back as HTML, so the body is read as text and
 * parsed here — calling .json() on it throws the evidence away and leaves a log
 * that says nothing.
 */
export async function sendEnquiry(
  payload: Record<string, string>,
  accessKey: string,
): Promise<{ delivered: boolean; reason?: string }> {
  try {
    /*
     * Sent as form data, not JSON, and that is not a style choice. A JSON body
     * sets Content-Type: application/json, which is not CORS-safelisted, so the
     * browser sends a preflight OPTIONS first — and Web3Forms answers it with
     * no Access-Control-Allow-Origin, so the real request never leaves. Form
     * data is a simple request: no preflight, which is also exactly how their
     * own HTML forms post.
     *
     * Content-Type is deliberately unset so the browser writes it, with the
     * multipart boundary it needs.
     */
    const form = new FormData();
    form.append("access_key", accessKey);
    for (const [field, value] of Object.entries(payload)) {
      form.append(field, value);
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    });

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

    return delivered
      ? { delivered: true }
      : { delivered: false, reason: `${response.status} ${body.slice(0, 200)}` };
  } catch (cause) {
    return { delivered: false, reason: String(cause) };
  }
}
