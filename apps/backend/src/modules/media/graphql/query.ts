import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { media } from "@/domain/db/schema";
import {
  MEDIA_ENUM_FIELDS,
  MEDIA_SORT_FIELD_MAP,
  MediaFilter,
  MediaSort,
} from "@/modules/media/graphql/inputs";
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

const MEDIA_COLUMNS = {
  objectKey: media.objectKey,
  url: media.url,
  alt: media.alt,
  type: media.type,
  mimeType: media.mimeType,
  filename: media.filename,
  size: media.size,
};

interface MediasConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

const MediasConnection =
  builder.objectRef<MediasConnectionShape>("MediasConnection");

MediasConnection.implement({
  description: "Paginated list of media items",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["media"],
      resolve: async (query, parent, _args, ctx) => {
        try {
          return await ctx.db.query.media.findMany(
            query({
              where: buildDrizzleWhere(parent.filter, MEDIA_ENUM_FIELDS),
              orderBy: buildDrizzleOrderBy(parent.sort, MEDIA_SORT_FIELD_MAP),
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
      resolve: createDbCountPageInfoResolver<MediasConnectionShape>({
        source: media,
        where: (parent) =>
          buildDrizzleSqlWhere(parent.filter, MEDIA_COLUMNS, MEDIA_ENUM_FIELDS),
        onError: handleDbError,
      }),
    }),
  }),
});

builder.queryField("medias", (t) =>
  t.field({
    type: MediasConnection,
    description: "Get all media items with pagination",
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of media items to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of media items to skip",
        defaultValue: 0,
      }),
      filter: t.arg({
        type: MediaFilter,
        required: false,
        description: "Filter media items by fields",
      }),
      sort: t.arg({
        type: [MediaSort],
        required: false,
        description: "Sort media items by fields",
      }),
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

builder.queryField("media", (t) =>
  t.drizzleField({
    type: "media",
    nullable: true,
    description: "Get a single media item by ID",
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      try {
        const mediaItem = await ctx.db.query.media.findFirst(
          query({
            where: {
              id: args.id,
            },
          }),
        );

        if (!mediaItem) {
          throw new NotFoundError("Media no encontrada");
        }

        return mediaItem;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
