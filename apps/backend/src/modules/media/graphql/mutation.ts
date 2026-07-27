import {
  CreateMediaPayloadSchema,
  DeleteMediaPayloadSchema,
  UpdateMediaPayloadSchema,
} from "@repo/schemas/media";
import { eq } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { NotFoundError, UnauthorizedError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { media } from "@/domain/db/schema";
import {
  CreateMediaInput,
  UpdateMediaInput,
} from "@/modules/media/graphql/inputs";
import { builder } from "@/shared/graphql/builder";

builder.mutationField("createMedia", (t) =>
  t.drizzleField({
    type: "media",
    authScopes: { authenticated: true },
    args: {
      input: t.arg({
        type: CreateMediaInput,
        required: true,
        description: "Data for creating a new media",
        validate: CreateMediaPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        const [createdMedia] = await ctx.db
          .insert(media)
          .values({
            objectKey: input.objectKey,
            url: input.url,
            alt: input.alt,
            type: input.type as typeof media.$inferInsert.type,
            size: input.size,
            mimeType: input.mimeType,
            filename: input.filename,
            uploadedBy: ctx.user.id,
          })
          .returning({ id: media.id });

        if (!createdMedia) {
          throw new Error("No se pudo crear el medio");
        }

        const result = await ctx.db.query.media.findFirst(
          query({ where: { id: createdMedia.id } }),
        );

        if (!result) throw new Error("No se pudo crear el medio");

        return result;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un medio con el mismo bucketId",
        });
      }
    },
  }),
);

builder.mutationField("updateMedia", (t) =>
  t.drizzleField({
    type: "media",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID to update",
        validate: UpdateMediaPayloadSchema.shape.id,
      }),
      input: t.arg({
        type: UpdateMediaInput,
        required: true,
        description: "Data for updating the media",
        validate: UpdateMediaPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      try {
        const [mediaItem] = await ctx.db
          .select({ uploadedBy: media.uploadedBy })
          .from(media)
          .where(eq(media.id, id))
          .limit(1);

        if (!mediaItem) {
          throw new NotFoundError("Medio no encontrado");
        }

        if (mediaItem.uploadedBy !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        await ctx.db
          .update(media)
          .set({
            ...(input.alt !== undefined && { alt: input.alt }),
            ...(input.url !== undefined && { url: input.url }),
            updatedAt: new Date(),
          })
          .where(eq(media.id, id));

        const updatedMedia = await ctx.db.query.media.findFirst(
          query({ where: { id } }),
        );

        if (!updatedMedia) throw new NotFoundError("Medio no encontrado");

        return updatedMedia;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.mutationField("deleteMedia", (t) =>
  t.drizzleField({
    type: "media",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Media ID to delete",
        validate: DeleteMediaPayloadSchema.shape.id,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const [mediaItem] = await ctx.db
          .select({ uploadedBy: media.uploadedBy })
          .from(media)
          .where(eq(media.id, id))
          .limit(1);

        if (!mediaItem) {
          throw new NotFoundError("Medio no encontrado");
        }

        if (mediaItem.uploadedBy !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        const fullMedia = await ctx.db.query.media.findFirst(
          query({ where: { id } }),
        );

        if (!fullMedia) {
          throw new NotFoundError("Medio no encontrado");
        }

        await ctx.db.delete(media).where(eq(media.id, id));

        return fullMedia;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
