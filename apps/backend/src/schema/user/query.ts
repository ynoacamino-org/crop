import type { Prisma } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { UsersPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { sanitize } from "@/lib/utils/sanitize";
import {
  calculatePaginationInfo,
  createPaginatedResponse,
} from "@/schema/pagination/model";

// Create paginated type for users
const UsersConnection = createPaginatedResponse("Users", "User");

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    authScopes: {
      authenticated: true,
    },
    resolve: async (_query, _root, _args, ctx) => {
      if (!ctx.user) return null;

      try {
        return await db.user.findUnique({
          where: { id: ctx.user.id },
        });
      } catch (error) {
        handlePrismaError(error, {
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
        ? {
            OR: [
              {
                name: {
                  contains: args.search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                email: {
                  contains: args.search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : undefined;

      try {
        const [items, totalCount] = await Promise.all([
          db.user.findMany({
            take: args.take,
            skip: args.skip,
            where: whereClause,
            orderBy: {
              createdAt: "desc",
            },
          }),
          db.user.count({ where: whereClause }),
        ]);

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
        handlePrismaError(error);
      }
    },
  }),
);
