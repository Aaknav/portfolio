"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-body " +
  "text-ink transition-colors placeholder:text-ink-muted/70 focus:border-accent";

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

const timelines = ["As soon as possible", "1–3 months", "3–6 months", "Just exploring"];

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-body-sm text-ink">
      {children}
      {optional ? (
        <span className="ml-1.5 text-ink-muted">(optional)</span>
      ) : null}
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
      {/* Honeypot — visually and programmatically hidden from people. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company" optional>
            Company
          </Label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClass}
          />
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
            className={fieldClass}
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="projectType-error" message={state.errors?.projectType} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="budget" optional>
            Budget
          </Label>
          <select
            id="budget"
            name="budget"
            defaultValue={budgets[0]}
            className={fieldClass}
          >
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="timeline" optional>
            Timeline
          </Label>
          <select
            id="timeline"
            name="timeline"
            defaultValue={timelines[0]}
            className={fieldClass}
          >
            {timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">What are you trying to build?</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder="The problem you’re trying to solve, roughly what you have in mind, and anything already in place."
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={state.errors?.message} />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-body-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
