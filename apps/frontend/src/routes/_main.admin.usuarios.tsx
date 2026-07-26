import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { UsersList } from "#/modules/users/components/users-list";
import { UsersDocument } from "#/service/gql/generated/gql.node";
import { createServerService } from "#/service/service.server";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
  search: z.string().optional(),
});

const getUsers = createServerFn()
  .validator(
    (input: {
      take?: number;
      skip?: number;
      filter?: { name?: { contains: string }; email?: { contains: string } };
    }) => input,
  )
  .handler(async ({ data }) => {
    const { gql } = createServerService();
    const result = await gql.query(UsersDocument, data).toPromise();
    return result?.data;
  });

export const Route = createFileRoute("/_main/admin/usuarios")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset, search } }) => ({
    limit,
    offset,
    search,
  }),
  loader: async ({ deps: { limit, offset, search } }) => {
    const filter = search ? { name: { contains: search } } : undefined;
    const data = await getUsers({
      data: { take: limit, skip: offset, filter },
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
