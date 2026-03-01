import { redirect } from "next/navigation";
import { getService } from "@/service/service.server";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { gql } = await getService();

  const result = await gql.query(
    `
      query {
        me {
          id
          role
        }
      }
    `,
    {},
  );

  // Redirect if not admin
  if (!result.data?.me || result.data.me.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}
