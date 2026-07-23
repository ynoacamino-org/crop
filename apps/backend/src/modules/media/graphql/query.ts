import { MediaPayloadSchema, MediasPayloadSchema } from "@repo/schemas/media";
import { handleDbError } from "@/core/errors/db";
import { sanitize } from "@/core/utils/sanitize";
import { builder } from "@/shared/graphql/builder";

builder.queryField("medias", (t) =>
  t.drizzleField({
    type: ["media"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of media items to take",
        defaultValue: 10,
        validate: MediasPayloadSchema.shape.take,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of media items to skip",
        defaultValue: 0,
        validate: MediasPayloadSchema.shape.skip,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for filename or alt text",
        validate: MediasPayloadSchema.shape.search,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);
      const search = args.search?.trim();
      const searchTerm = search ? `%${search}%` : undefined;

      try {
        return await ctx.db.query.media.findMany(
          query({
            where: searchTerm
              ? {
                  OR: [
                    { filename: { ilike: searchTerm } },
                    { alt: { ilike: searchTerm } },
                  ],
                }
              : undefined,
            orderBy: {
              createdAt: "desc",
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

builder.queryField("media", (t) =>
  t.drizzleField({
    type: "media",
    nullable: true,
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID",
        validate: MediaPayloadSchema.shape.id,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      try {
        return await ctx.db.query.media.findFirst(
          query({
            where: {
              id: args.id,
            },
          }),
        );
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
