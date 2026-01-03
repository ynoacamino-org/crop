import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MeDocument } from "@/gql/generated/gql.node";
import { service } from "@/gql/service";
import { UserProvider } from "./user-provider";

export async function UserServerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userMe = await service.query(MeDocument, {});

  if (userMe.error || !userMe.data?.me) {
    const cookieStore = await cookies();

    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });

    redirect("/login");
  }

  return <UserProvider user={userMe.data?.me}>{children}</UserProvider>;
}
