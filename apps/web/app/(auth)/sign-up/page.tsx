import type { Metadata } from "next";
import Link from "next/link";

import { AuthLayout } from "@/components/layout";

import { SignUpForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a new account.",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Free to start. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
