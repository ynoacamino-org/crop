import { Navbar } from "@/modules/posts/components";
import { Toaster } from "@/shared/components/ui/sonner";
import { UserServerProvider } from "@/shared/providers/user-server-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserServerProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Toaster />
      </div>
    </UserServerProvider>
  );
}
