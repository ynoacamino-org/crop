import { handleDbError } from "@/core/errors/db";
import { users } from "@/domain/db/schema";
import {
  USER_ENUM_FIELDS,
  USER_SORT_FIELD_MAP,
  UserFilter,
  UserSort,
} from "@/modules/business/user/inputs";
import { builder } from "@/shared/graphql/builder";
import { createConnectionType } from "@/shared/graphql/connection";

const USER_COLUMNS = {
  name: users.name,
  email: users.email,
  role: users.role,
  bio: users.bio,
};

const { listQuery } = createConnectionType({
  typeName: "UsersConnection",
  description: "Paginated list of users",
  table: users,
  itemType: "users",
  filterInput: UserFilter,
  sortInput: UserSort,
  enumFields: USER_ENUM_FIELDS,
  fieldMap: USER_SORT_FIELD_MAP,
  columns: USER_COLUMNS,
  authScopes: { admin: true },
});

listQuery("users", "Get all users with pagination");

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
