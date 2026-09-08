import type { Metadata } from "next";
import Link from "next/link";

import { AuthLayout } from "@/components/layout";

import { ForgotPasswordForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we'll send a link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
