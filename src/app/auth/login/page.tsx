// src/app/auth/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - PyRoutes",
  description: "Log in to your PyRoutes account.",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
