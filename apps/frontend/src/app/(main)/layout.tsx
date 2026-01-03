import { UserServerProvider } from "@/shared/providers/user-server-provider";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return <UserServerProvider>{children}</UserServerProvider>;
}
