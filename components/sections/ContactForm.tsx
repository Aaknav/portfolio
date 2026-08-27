"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";

const initialState: ContactState = { status: "idle" };

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

const fieldClass =
  "w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-body " +
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
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-border bg-surface p-8"
      >
        <p className="text-display-md">Message sent.</p>
        <p className="mt-3 text-body text-ink-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {/*
        The summary belongs at the top of the form, not above the submit button
        where it used to sit: it told people to "check the fields below" while
        every field was above it. Naming the fields — and linking to them — beats
        making someone scan a nine-field form for red text.
      */}
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="flex flex-col gap-2 border-l-2 border-danger bg-surface p-4"
        >
          <p className="text-body-sm text-danger">{state.message}</p>
          {state.errors ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {Object.keys(state.errors).map((field) => (
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
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={state.errors?.name} />
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
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={state.errors?.email} />
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
        <FieldError
          id="projectType-error"
          message={state.errors?.projectType}
        />
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
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={state.errors?.message} />
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
