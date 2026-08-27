"use client";

import { useState } from "react";
import {
  sendEnquiry,
  validateEnquiry,
  type EnquiryErrors,
} from "@/lib/contact";
import { env } from "@/lib/env";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

/* The summary names fields the way their labels do, not the way the schema
   does. Keep in step with the labels below. */
const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  projectType: "What do you need?",
  budget: "Budget",
  timeline: "Timeline",
  message: "What are you trying to build?",
};

/*
 * h-11 rather than vertical padding: an <input> and a <select> given identical
 * padding still come out different heights, because each browser applies its
 * own intrinsic line box to a select. Setting the height explicitly is what
 * makes a row of mixed controls line up. 44px is also a comfortable touch
 * target.
 */
const fieldClass =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body " +
  "text-ink transition-colors placeholder:text-ink-muted/70 focus:border-accent";

/* Selects need room on the right for the native arrow, which otherwise draws
   straight over the end of the longest option — "As soon as possible" was
   losing its last letters. */
const selectClass = `${fieldClass} pr-9`;

/*
 * The message box is where a visitor types their own "before", so it wears the
 * dashed frame the hero's scraps do — the one place the form joins the argument
 * the rest of the page makes.
 *
 * Dashed, but at --border-strong rather than --before-line. This is an input
 * boundary, so WCAG 1.4.11 wants 3:1 against the surface behind it, and
 * --before-line measures about 1.9:1 on --bg. The dashes carry the reference;
 * the weight keeps it usable.
 */
const messageClass =
  "w-full resize-y rounded-md border border-dashed border-border-strong bg-bg " +
  "px-3 py-2.5 text-body text-ink transition-colors " +
  "placeholder:text-ink-muted/70 focus:border-solid focus:border-accent";

const projectTypes = [
  "Business website",
  "Custom web application",
  "Business tool or dashboard",
  "Ongoing support & maintenance",
  "Something else",
];

const budgets = [
  "Not sure yet",
  "Under ₹50,000",
  "₹50,000 – ₹1,50,000",
  "₹1,50,000 – ₹4,00,000",
  "₹4,00,000+",
];

const timelines = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "Just exploring",
];

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-body-sm text-ink">
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-body-sm text-danger">
      {message}
    </p>
  );
}

export function ContactForm() {
  /*
   * Submits from the browser rather than through a Server Action: Web3Forms is
   * behind Cloudflare, which answers a server-side POST with a challenge page
   * and a 403. See lib/contact.ts.
   */
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const pending = status === "sending";

  /* onSubmit wants a void return, so the async work is kicked off inside a
     synchronous handler rather than handing React a promise it will not await. */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(event.currentTarget);
  };

  const submit = async (form: HTMLFormElement) => {
    const result = validateEnquiry(new FormData(form));

    if (!result.ok) {
      setErrors(result.errors);
      setStatus("error");
      setMessage("Please check the fields below.");
      return;
    }

    setErrors({});
    setStatus("sending");

    /* A bot that filled the honeypot is told it worked and nothing is sent. */
    if (result.trap) {
      setStatus("sent");
      return;
    }

    const key = env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!key) {
      setStatus("error");
      setMessage(
        `Something went wrong sending that. Please email me directly at ${site.email}.`,
      );
      return;
    }

    const { delivered, reason } = await sendEnquiry(result.payload, key);
    if (!delivered) {
      console.error("Enquiry was not delivered:", reason);
      setStatus("error");
      setMessage(
        `Something went wrong sending that. Please email me directly at ${site.email}.`,
      );
      return;
    }

    form.reset();
    setStatus("sent");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {/*
        The summary belongs at the top of the form, not above the submit button
        where it used to sit: it told people to "check the fields below" while
        every field was above it. Naming the fields — and linking to them — beats
        making someone scan a nine-field form for red text.
      */}
      {status === "error" && message ? (
        <div
          role="alert"
          className="flex flex-col gap-2 border-l-2 border-danger bg-surface p-4"
        >
          <p className="text-body-sm text-danger">{message}</p>
          {Object.keys(errors).length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {Object.keys(errors).map((field) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    className="text-body-sm text-danger underline underline-offset-4"
                  >
                    {FIELD_LABELS[field] ?? field}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Honeypot — visually and programmatically hidden from people. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Required path first and short: who you are, what you need, what is
          wrong. Everything optional sits below the message, so the form reads
          as four questions rather than seven. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <Label htmlFor="projectType">What do you need?</Label>
        {/* Native select on purpose — faster and more accessible on mobile
            than a JS-built dropdown. */}
        <select
          id="projectType"
          name="projectType"
          required
          defaultValue={projectTypes[0]}
          className={selectClass}
        >
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError id="projectType-error" message={errors.projectType} />
      </div>

      <div>
        <Label htmlFor="message">What are you trying to build?</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={messageClass}
          placeholder="The problem you’re trying to solve, roughly what you have in mind, and anything already in place."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* The three questions that sharpen a quote but must never block one.
          Grouped and set apart so the form does not read as seven fields. */}
      <fieldset className="border border-border p-4 md:p-5">
        <legend className="label px-2 text-ink-muted">
          Optional — helps me quote
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company">Company</Label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="budget">Budget</Label>
            <select
              id="budget"
              name="budget"
              defaultValue={budgets[0]}
              className={selectClass}
            >
              {budgets.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <select
              id="timeline"
              name="timeline"
              defaultValue={timelines[0]}
              className={selectClass}
            >
              {timelines.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {timeline}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
