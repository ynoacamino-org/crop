import { Navbar } from "@/shared/components/layout";
import { Toaster } from "@/shared/components/ui/sonner";
import { UserServerProvider } from "@/shared/providers/user-server-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <UserServerProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Navbar />
        <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Toaster />
      </div>
    </UserServerProvider>
  );
}
