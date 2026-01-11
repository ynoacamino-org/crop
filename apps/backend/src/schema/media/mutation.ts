import { handlePrismaError } from "@prisma/lib/error-handler";
import {
  CreateMediaPayloadSchema,
  DeleteMediaPayloadSchema,
  UpdateMediaPayloadSchema,
} from "@repo/schemas/media";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { CreateMediaInput, UpdateMediaInput } from "./inputs";

builder.mutationField("createMedia", (t) =>
  t.prismaField({
    type: "Media",
    authScopes: { collaborator: true },
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
        return await db.media.create({
          ...query,
          data: {
            objectKey: input.objectKey,
            url: input.url,
            alt: input.alt,
            type: input.type as "IMAGE" | "VIDEO" | "AUDIO",
            size: input.size,
            mimeType: input.mimeType,
            filename: input.filename,
            uploadedBy: ctx.user.id,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un medio con el mismo bucketId",
        });
      }
    },
  }),
);

builder.mutationField("updateMedia", (t) =>
  t.prismaField({
    type: "Media",
    authScopes: { collaborator: true },
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
        const media = await db.media.findUnique({
          where: { id },
          select: { uploadedBy: true },
        });

        if (!media) {
          throw new NotFoundError("Medio no encontrado");
        }

        if (media.uploadedBy !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        return await db.media.update({
          ...query,
          where: { id },
          data: {
            ...(input.alt !== undefined && { alt: input.alt }),
            ...(input.url && { url: input.url }),
          },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);

builder.mutationField("deleteMedia", (t) =>
  t.prismaField({
    type: "Media",
    authScopes: { collaborator: true },
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
        const media = await db.media.findUnique({
          where: { id },
          select: { uploadedBy: true },
        });

        if (!media) {
          throw new NotFoundError("Medio no encontrado");
        }

        if (media.uploadedBy !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        return await db.media.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
