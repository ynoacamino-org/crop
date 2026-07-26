"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AccountPopover } from "@/modules/auth/components/ui/account-popover";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <h2 className="font-semibold text-lg tracking-tight">
            Sistema Legal Peruano
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccountPopover />
        </div>
      </div>
    </header>
  );
}
