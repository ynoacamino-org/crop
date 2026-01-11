import { handlePrismaError } from "@prisma/lib/error-handler";
import { UsersPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    authScopes: {
      collaborator: true,
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
  t.prismaField({
    type: ["User"],
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
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.user.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
          where: args.search
            ? {
                OR: [
                  {
                    name: {
                      contains: args.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: args.search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : undefined,
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
