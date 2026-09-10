"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Client halves of the `(auth)` routes — the interactive form controls.
 *
 * Every form here is a pattern showcase: uncontrolled inputs, nothing
 * persisted, `onSubmit` stubbed to a toast. Wire each to a Server Action (and
 * real validation) in a consuming app. The page shells stay server components.
 */

function useDemoSubmit(message: string) {
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      toast.info(message, {
        description: "This template ships no auth — connect a provider.",
      });
    }, 600);
  }

  return { pending, handleSubmit };
}

export function SignInForm() {
  const { pending, handleSubmit } = useDemoSubmit("Sign-in submitted");

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="signin-email">Email</FieldLabel>
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="signin-password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="signin-remember" defaultChecked />
          <FieldLabel htmlFor="signin-remember" className="font-normal">
            Keep me signed in
          </FieldLabel>
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function SignUpForm() {
  const { pending, handleSubmit } = useDemoSubmit("Account creation submitted");

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
          <Input
            id="signup-name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-email">Work email</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-password">Password</FieldLabel>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
          />
          <FieldDescription>
            Use 8 or more characters with a mix of letters and numbers.
          </FieldDescription>
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { pending, handleSubmit } = useDemoSubmit("Reset link requested");

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll send a reset link if an account matches.
          </FieldDescription>
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </FieldGroup>
    </form>
  );
}
