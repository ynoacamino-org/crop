import { DynamicBreadcrumb } from "@/shared/components/layout/dynamic-breadcrumb";
import { Navbar } from "@/shared/components/layout/navbar";
import { Toaster } from "@/shared/components/ui/sonner";
import { UserServerProvider } from "@/shared/providers/user-server-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <UserServerProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <DynamicBreadcrumb />
          {children}
        </main>
        <Toaster />
      </div>
    </UserServerProvider>
  );
}
