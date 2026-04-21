import { MediaPayloadSchema, MediasPayloadSchema } from "@repo/schemas/media";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { builder } from "@/builder";
import { media } from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("medias", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        const conditions = [
          args.type
            ? eq(media.type, args.type as typeof media.$inferSelect.type)
            : undefined,
          args.search
            ? or(
                ilike(media.filename, `%${args.search}%`),
                ilike(media.alt, `%${args.search}%`),
              )
            : undefined,
        ].filter((condition): condition is NonNullable<typeof condition> =>
          Boolean(condition),
        );

        const filters = conditions.length ? and(...conditions) : undefined;

        return await db
          .select()
          .from(media)
          .where(filters)
          .orderBy(desc(media.createdAt))
          .limit(args.take ?? 10)
          .offset(args.skip ?? 0);
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("media", (t) =>
  t.field({
    type: "Media",
    nullable: true,
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID",
        validate: MediaPayloadSchema.shape.id,
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        const [mediaItem] = await db
          .select()
          .from(media)
          .where(eq(media.id, args.id))
          .limit(1);

        return mediaItem ?? null;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
