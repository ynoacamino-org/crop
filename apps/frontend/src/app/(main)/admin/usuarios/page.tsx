import { UsersList } from "@/modules/users/components/users-list";
import {
  UsersDocument,
  type UsersQuery,
  type UsersQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { parsePaginationParams } from "@/shared/lib/pagination";

interface UsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { limit, offset } = await parsePaginationParams(searchParams);
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;

  const { gql } = await getService();

  const result = await gql.query<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    {
      take: limit,
      skip: offset,
      search,
    },
  );

  const users = result.data?.users.items || [];

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios del sistema
        </p>
      </div>

      <UsersList users={users} />
    </div>
  );
}
