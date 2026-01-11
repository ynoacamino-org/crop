import { handlePrismaError } from "@prisma/lib/error-handler";
import { MediaPayloadSchema, MediasPayloadSchema } from "@repo/schemas/media";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("medias", (t) =>
  t.prismaField({
    type: ["Media"],
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
      type: t.arg.string({
        required: false,
        description: "Filter by media type (IMAGE, VIDEO, AUDIO)",
        validate: MediasPayloadSchema.shape.type,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for filename or alt text",
        validate: MediasPayloadSchema.shape.search,
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.media.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
          where: {
            ...(args.type && {
              type: args.type as "IMAGE" | "VIDEO" | "AUDIO",
            }),
            ...(args.search && {
              OR: [
                { filename: { contains: args.search, mode: "insensitive" } },
                { alt: { contains: args.search, mode: "insensitive" } },
              ],
            }),
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);

builder.queryField("media", (t) =>
  t.prismaField({
    type: "Media",
    nullable: true,
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID",
        validate: MediaPayloadSchema.shape.id,
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.media.findUnique({
          ...query,
          where: { id: args.id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
