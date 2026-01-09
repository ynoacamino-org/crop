"use client";

import { AccountPopover } from "@/modules/auth/components/account-popover";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-xl">Crop</h2>
          <nav className="hidden gap-6 md:flex">
            <a
              href="/"
              className="font-medium text-sm transition-colors hover:text-primary"
            >
              Posts
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <AccountPopover />
        </div>
      </div>
    </header>
  );
}
