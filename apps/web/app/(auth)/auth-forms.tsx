"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";

/**
 * Client halves of the `(auth)` routes — the interactive form controls,
 * wired to Better Auth (`lib/auth-client.ts`). The page shells stay server
 * components; see `app/(auth)/sign-in/page.tsx` etc.
 */

function fieldValue(form: HTMLFormElement, name: string): string {
  return (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
}

/** Where middleware sent the visitor from, read at submit time so this
 *  component needs no `useSearchParams` (and no Suspense boundary). */
function redirectTarget(): string {
  if (typeof window === "undefined") return "/dashboard";
  return new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
}

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);

    const { error } = await authClient.signIn.email({
      email: fieldValue(form, "email"),
      password: fieldValue(form, "password"),
      rememberMe: (form.elements.namedItem("remember") as HTMLInputElement | null)?.checked,
    });

    setPending(false);
    if (error) {
      toast.error("Couldn't sign in", { description: error.message });
      return;
    }
    router.push(redirectTarget());
    router.refresh();
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="signin-email">Email</FieldLabel>
          <Input
            id="signin-email"
            name="email"
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
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="signin-remember" name="remember" defaultChecked />
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
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);

    const { error } = await authClient.signUp.email({
      name: fieldValue(form, "name"),
      email: fieldValue(form, "email"),
      password: fieldValue(form, "password"),
    });

    setPending(false);
    if (error) {
      toast.error("Couldn't create account", { description: error.message });
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
          <Input
            id="signup-name"
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-email">Work email</FieldLabel>
          <Input
            id="signup-email"
            name="email"
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
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
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
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);

    // Always succeeds from the caller's perspective (Better Auth doesn't
    // leak whether the email exists). It only *sends* anything once a
    // consuming app configures `emailAndPassword.sendResetPassword` in
    // apps/api/src/auth.ts — dormant until then, like the monitoring
    // integrations in docs/MONITORING.md.
    const { error } = await authClient.requestPasswordReset({
      email: fieldValue(form, "email"),
      redirectTo: "/sign-in",
    });

    setPending(false);
    if (error) {
      toast.error("Couldn't request a reset", { description: error.message });
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        If an account matches that email, a reset link is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            name="email"
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
