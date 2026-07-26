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
import { createConnectionType } from "@/shared/graphql/connection";

const MEDIA_COLUMNS = {
  objectKey: media.objectKey,
  url: media.url,
  alt: media.alt,
  type: media.type,
  mimeType: media.mimeType,
  filename: media.filename,
  size: media.size,
};

const { listQuery } = createConnectionType({
  typeName: "MediasConnection",
  description: "Paginated list of media items",
  table: media,
  itemType: "media",
  filterInput: MediaFilter,
  sortInput: MediaSort,
  enumFields: MEDIA_ENUM_FIELDS,
  fieldMap: MEDIA_SORT_FIELD_MAP,
  columns: MEDIA_COLUMNS,
});

listQuery("medias", "Get all media items with pagination");

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
