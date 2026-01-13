import { redirect } from "next/navigation";
import { MeDocument } from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { UserProvider } from "./user-provider";

export async function UserServerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const service = await getService();
    const userMe = await service.gql.query(MeDocument, {}).toPromise();

    if (userMe.error || !userMe.data?.me) {
      redirect("/iniciar-sesion");
    }

    return <UserProvider user={userMe.data?.me}>{children}</UserProvider>;
  } catch {
    redirect("/iniciar-sesion");
  }
}
