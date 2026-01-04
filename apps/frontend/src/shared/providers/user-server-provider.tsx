import { redirect } from "next/navigation";
import { MeDocument } from "@/gql/generated/gql.node";
import { getService } from "@/gql/service.server";
import { UserProvider } from "./user-provider";

export async function UserServerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const service = await getService();
  const userMe = await service.query(MeDocument, {}).toPromise();

  if (userMe.error || !userMe.data?.me) {
    redirect("/iniciar-sesion");
  }

  return <UserProvider user={userMe.data?.me}>{children}</UserProvider>;
}
