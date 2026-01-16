import { handlePrismaError } from "@prisma/lib/error-handler";
import {
  CreatePostPayloadSchema,
  DeletePostPayloadSchema,
  UpdatePostPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { CreatePostInput, UpdatePostInput } from "./inputs";

builder.mutationField("createPost", (t) =>
  t.prismaField({
    type: "Post",
    authScopes: { public: true },
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
        description: "Data for creating a new post",
        validate: CreatePostPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        return await db.post.create({
          ...query,
          data: {
            title: input.title,
            description: input.description,
            mediaId: input.mediaId,
            authorId: ctx.user.id,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un post con los mismos valores en",
        });
      }
    },
  }),
);

builder.mutationField("updatePost", (t) =>
  t.prismaField({
    type: "Post",
    authScopes: { collaborator: true },
    args: {
      id: t.arg.id({
        required: true,
        description: "ID of the post to update",
        validate: UpdatePostPayloadSchema.shape.id,
      }),
      input: t.arg({
        type: UpdatePostInput,
        required: true,
        description: "Data for updating the post",
        validate: UpdatePostPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) {
        throw new UnauthorizedError();
      }

      const { id, input } = sanitize(rawArgs);

      try {
        return await db.post.update({
          ...query,
          where: { id },
          data: {
            title: input.title,
            description: input.description,
            mediaId: input.mediaId,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "El post tiene campos duplicados en",
          notFound: "El post que intenta actualizar no existe",
        });
      }
    },
  }),
);

builder.mutationField("deletePost", (t) =>
  t.prismaField({
    type: "Post",
    authScopes: { public: true },
    args: {
      id: t.arg.id({
        required: true,
        description: "ID of the post to delete",
        validate: DeletePostPayloadSchema.shape.id,
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        return await db.post.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "El post que intenta eliminar no existe",
        });
      }
    },
  }),
);
