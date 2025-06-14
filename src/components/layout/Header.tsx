// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { PyRoutesLogo } from "@/components/icons";
import { UserNav } from "./UserNav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, LayoutDashboard, MessageSquare } from "lucide-react";
import React from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  // Add more items as needed
];


export function Header() {
  const { isAuthenticated, loading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PyRoutesLogo className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:hidden">
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link href="/" onClick={() => setIsSheetOpen(false)}>
                    <PyRoutesLogo className="h-8 w-auto" />
                  </Link>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  {isAuthenticated && navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className="flex items-center gap-3 rounded-md p-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {!isAuthenticated && !loading && (
                   <div className="p-4 mt-auto border-t">
                     <Button asChild className="w-full mb-2" onClick={() => setIsSheetOpen(false)}>
                        <Link href="/auth/login">Log In</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full" onClick={() => setIsSheetOpen(false)}>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                   </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated ? (
            <UserNav />
          ) : (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
