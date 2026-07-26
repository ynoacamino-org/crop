import { handleDbError } from "@/core/errors/db";
import { sanitize } from "@/core/utils/sanitize";
import { users } from "@/domain/db/schema";
import {
  USER_ENUM_FIELDS,
  USER_SORT_FIELD_MAP,
  UserFilter,
  UserSort,
} from "@/modules/business/user/inputs";
import { builder } from "@/shared/graphql/builder";
import {
  buildDrizzleOrderBy,
  buildDrizzleSqlWhere,
  buildDrizzleWhere,
} from "@/shared/graphql/filters";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

const USER_COLUMNS = {
  name: users.name,
  email: users.email,
  role: users.role,
  bio: users.bio,
};

interface UsersConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

const UsersConnection =
  builder.objectRef<UsersConnectionShape>("UsersConnection");

UsersConnection.implement({
  description: "Paginated list of users",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["users"],
      resolve: async (query, parent, _args, ctx) => {
        try {
          return await ctx.db.query.users.findMany(
            query({
              where: buildDrizzleWhere(parent.filter, USER_ENUM_FIELDS),
              orderBy: buildDrizzleOrderBy(parent.sort, USER_SORT_FIELD_MAP),
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
        where: (parent) =>
          buildDrizzleSqlWhere(parent.filter, USER_COLUMNS, USER_ENUM_FIELDS),
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
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of users to skip",
        defaultValue: 0,
      }),
      filter: t.arg({
        type: UserFilter,
        required: false,
        description: "Filter users by fields",
      }),
      sort: t.arg({
        type: [UserSort],
        required: false,
        description: "Sort users by fields",
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
        filter: args.filter ?? undefined,
        sort: args.sort ?? undefined,
      };
    },
  }),
);
