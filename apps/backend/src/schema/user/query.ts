import { UsersPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: async (_query, _root, _args, ctx) => {
      if (!ctx.user) return null;

      return db.user.findUnique({
        where: { id: ctx.user.id },
      });
    },
    authScopes: {
      collaborator: true,
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
    resolve: async (query, _root, args) => {
      return db.user.findMany({
        ...query,
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
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
    },
  }),
);
