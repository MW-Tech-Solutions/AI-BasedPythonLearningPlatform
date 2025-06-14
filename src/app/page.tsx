// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { PyRoutesLogo, PythonIcon } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Brain, Code } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  const features = [
    {
      icon: CheckCircle,
      title: "Interactive Lessons",
      description: "Engage with hands-on Python exercises and clear explanations.",
    },
    {
      icon: Brain,
      title: "AI Code Assistant",
      description: "Get instant help and hints from our Gemini-powered chatbot.",
    },
    {
      icon: Code,
      title: "In-Browser Editor",
      description: "Code directly in your browser, no setup required.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PyRoutesLogo className="h-8 w-auto" />
          </Link>
          <nav className="space-x-2">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6 text-center">
            <PythonIcon className="mx-auto h-20 w-20 text-primary mb-6" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
              Master Python, the <span className="text-primary">Interactive</span> Way
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              PyRoutes offers a structured path to Python proficiency with hands-on lessons, an AI assistant, and progress tracking. Start your coding journey today!
            </p>
            <div className="mt-10">
              {loading ? (
                 <Button size="lg" className="w-48 h-12 animate-pulse bg-muted" disabled> </Button>
              ) : isAuthenticated ? (
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link href="/dashboard">Explore Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link href="/auth/signup">Get Started for Free</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12 font-headline">
              Why PyRoutes?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                       <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-muted/50">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PyRoutes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
