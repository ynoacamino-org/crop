import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sdk } from "#/lib/graphql-client";
import { UsersList } from "#/modules/users/components/users-list";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_main/admin/usuarios")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset, search } }) => ({
    limit,
    offset,
    search,
  }),
  loader: async ({ deps: { limit, offset, search } }) => {
    const data = await sdk.users({
      take: limit,
      skip: offset,
      search,
    });
    return {
      usersData: data?.users,
    };
  },
  component: UsersPage,
});

function UsersPage() {
  const { usersData } = Route.useLoaderData();
  const users = usersData?.items || [];

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
