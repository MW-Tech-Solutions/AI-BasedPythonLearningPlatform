// src/app/auth/signup/page.tsx
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - PyRoutes",
  description: "Create your PyRoutes account to start learning Python.",
};

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
