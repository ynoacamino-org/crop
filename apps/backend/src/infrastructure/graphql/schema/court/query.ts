import { builder } from "@/infrastructure/graphql/builder";
import { handleDbError } from "@/infrastructure/lib/errors/db";
import { NotFoundError } from "@/infrastructure/lib/errors/gql";
import { sanitize } from "@/infrastructure/lib/utils/sanitize";

builder.queryField("courts", (t) =>
  t.drizzleField({
    type: ["courts"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of courts to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of courts to skip",
        defaultValue: 0,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for court name",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);
      const search = args.search?.trim();
      const searchTerm = search ? `%${search}%` : undefined;

      try {
        return await ctx.db.query.courts.findMany(
          query({
            where: searchTerm
              ? {
                  name: {
                    ilike: searchTerm,
                  },
                }
              : undefined,
            orderBy: {
              name: "asc",
            },
            limit: args.take ?? 10,
            offset: args.skip ?? 0,
          }),
        );
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("court", (t) =>
  t.drizzleField({
    type: "courts",
    args: {
      id: t.arg.string({
        required: true,
        description: "Court ID",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      try {
        const court = await ctx.db.query.courts.findFirst(
          query({
            where: {
              id: args.id,
            },
          }),
        );

        if (!court) {
          throw new NotFoundError("Corte no encontrada");
        }

        return court;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
