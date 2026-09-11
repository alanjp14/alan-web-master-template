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
            Real sessions, not a demo.
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            This form calls Better Auth (`apps/api`) over email/password — a
            signed-in session protects every `/dashboard` route server-side.
            `AuthLayout` still gives you the centered card, the optional
            split panel, the brand mark and the theme controls to restyle.
          </p>
        </div>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
