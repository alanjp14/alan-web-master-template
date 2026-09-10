import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";

import { AuthLayout } from "@/components/layout";

import { SignInForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create one
          </Link>
        </>
      }
      aside={
        <div className="max-w-sm space-y-4">
          <ShieldCheckIcon
            className="size-8 text-primary"
            aria-hidden="true"
          />
          <p className="font-heading text-2xl font-medium text-balance">
            The auth screens are layout, not logic.
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            `AuthLayout` gives you the centered card, the optional split panel,
            the brand mark and the theme controls. Bring your own provider and
            wire the form to a Server Action.
          </p>
        </div>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
