import { UsersPayloadSchema } from "@repo/schemas";
import { ilike, or } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { sanitize } from "@/core/utils/sanitize";
import { users } from "@/domain/db/schema";
import { builder } from "@/shared/graphql/builder";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

interface UsersConnectionShape {
  take: number;
  skip: number;
  search?: string;
}

const UsersConnection =
  builder.objectRef<UsersConnectionShape>("UsersConnection");

UsersConnection.implement({
  description: "Paginated list of users",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["users"],
      resolve: async (query, parent, _args, ctx) => {
        const search = parent.search?.trim();
        const searchTerm = search ? `%${search}%` : undefined;

        try {
          return await ctx.db.query.users.findMany(
            query({
              where: searchTerm
                ? {
                    OR: [
                      { name: { ilike: searchTerm } },
                      { email: { ilike: searchTerm } },
                    ],
                  }
                : undefined,
              orderBy: {
                createdAt: "desc",
              },
              limit: parent.take,
              offset: parent.skip,
            }),
          );
        } catch (error) {
          handleDbError(error);
        }
      },
    }),
    pageInfo: t.field({
      type: PaginationInfo,
      resolve: createDbCountPageInfoResolver<UsersConnectionShape>({
        source: users,
        where: (parent) => {
          const search = parent.search?.trim();
          const searchTerm = search ? `%${search}%` : undefined;

          return searchTerm
            ? or(ilike(users.name, searchTerm), ilike(users.email, searchTerm))
            : undefined;
        },
        onError: handleDbError,
      }),
    }),
  }),
});

builder.queryField("me", (t) =>
  t.drizzleField({
    type: "users",
    nullable: true,
    authScopes: {
      authenticated: true,
    },
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user) return null;

      try {
        return await ctx.db.query.users.findFirst(
          query({
            where: {
              id: ctx.user.id,
            },
          }),
        );
      } catch (error) {
        handleDbError(error, {
          notFound: "Usuario no encontrado",
        });
      }
    },
  }),
);

builder.queryField("users", (t) =>
  t.field({
    type: UsersConnection,
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of users to take",
        defaultValue: 10,
        validate: UsersPayloadSchema.shape.take,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of users to skip",
        defaultValue: 0,
        validate: UsersPayloadSchema.shape.skip,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for user name or email",
        validate: UsersPayloadSchema.shape.search,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        search: args.search?.trim() || undefined,
      };
    },
  }),
);
