import { handlePrismaError } from "@prisma/lib/error-handler";
import {
  CreatePostPayloadSchema,
  DeletePostPayloadSchema,
  UpdatePostPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";
import { UNAUTHORIZED_ERROR } from "@/lib/errors";
import { CreatePostInput, UpdatePostInput } from "./inputs";

builder.mutationField("createPost", (t) =>
  t.prismaField({
    type: "Post",
    authScopes: { public: true },
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
        validate: CreatePostPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) throw new UNAUTHORIZED_ERROR();

      try {
        return await db.post.create({
          ...query,
          data: {
            title: args.input.title,
            description: args.input.description,
            image: args.input.image,
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
        validate: UpdatePostPayloadSchema.shape.id,
      }),
      input: t.arg({
        type: UpdatePostInput,
        required: true,
        validate: UpdatePostPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) {
        throw new UNAUTHORIZED_ERROR();
      }

      try {
        return await db.post.update({
          ...query,
          where: { id: args.id },
          data: {
            title: args.input.title ?? undefined,
            description: args.input.description ?? undefined,
            image: args.input.image ?? undefined,
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
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) throw new UNAUTHORIZED_ERROR();

      try {
        return await db.post.delete({
          ...query,
          where: { id: args.id },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "El post que intenta eliminar no existe",
        });
      }
    },
  }),
);
