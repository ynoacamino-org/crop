import { UsersPayloadSchema } from "@repo/schemas";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { builder } from "@/builder";
import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
import { sanitize } from "@/lib/utils/sanitize";
import {
  calculatePaginationInfo,
  createPaginatedResponse,
} from "@/schema/pagination/model";

// Create paginated type for users
const UsersConnection = createPaginatedResponse("Users", "User");

builder.queryField("me", (t) =>
  t.field({
    type: "User",
    nullable: true,
    authScopes: {
      authenticated: true,
    },
    resolve: async (_root, _args, ctx) => {
      if (!ctx.user) return null;

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        return user ?? null;
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
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      const whereClause = args.search
        ? or(
            ilike(users.name, `%${args.search}%`),
            ilike(users.email, `%${args.search}%`),
          )
        : undefined;

      try {
        const itemsQuery = db
          .select()
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(args.take ?? 10)
          .offset(args.skip ?? 0);

        const countQuery = db
          .select({ totalCount: sql<number>`count(*)::int` })
          .from(users);

        const [items, totalCountRows] = await Promise.all([
          whereClause ? itemsQuery.where(whereClause) : itemsQuery,
          whereClause ? countQuery.where(whereClause) : countQuery,
        ]);

        const totalCount = totalCountRows[0]?.totalCount ?? 0;

        const pageInfo = calculatePaginationInfo({
          totalCount,
          take: args.take ?? 10,
          skip: args.skip ?? 0,
        });

        return {
          items,
          pageInfo,
        };
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
