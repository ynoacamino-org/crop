import { AccountPopover } from "@/modules/auth/components/ui/account-popover";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-lg tracking-tight">
            Sistema Legal Peruano
          </span>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-2"
        >
          <ThemeToggle />
          <AccountPopover />
        </nav>
      </div>
    </header>
  );
}
