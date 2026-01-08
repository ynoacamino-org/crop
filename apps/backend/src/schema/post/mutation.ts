import {
  CreatePostPayloadSchema,
  DeletePostPayloadSchema,
  UpdatePostPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";

const CreatePostInput = builder.inputType("CreatePostInput", {
  fields: (t) => ({
    title: t.string({
      required: true,
      description: "Title of the post",
      validate: CreatePostPayloadSchema.shape.input.shape.title,
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: CreatePostPayloadSchema.shape.input.shape.description,
    }),
    image: t.string({
      required: false,
      description: "Image URL of the post",
      validate: CreatePostPayloadSchema.shape.input.shape.image,
    }),
  }),
});

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
      if (!ctx.user) throw new Error("Unauthorized");

      return db.post.create({
        ...query,
        data: {
          title: args.input.title,
          description: args.input.description,
          image: args.input.image,
        },
      });
    },
  }),
);

// Mutation: Update post
const UpdatePostInput = builder.inputType("UpdatePostInput", {
  fields: (t) => ({
    title: t.string({
      required: false,
      description: "Title of the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.title,
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.description,
    }),
    image: t.string({
      required: false,
      description: "Image URL of the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.image,
    }),
  }),
});

builder.mutationField("updatePost", (t) =>
  t.prismaField({
    type: "Post",
    authScopes: { public: true },
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({
        type: UpdatePostInput,
        required: true,
        validate: UpdatePostPayloadSchema.shape.input,
      }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const post = await db.post.findUnique({
        where: { id: Number(args.id) },
      });

      if (!post) throw new Error("Post not found");

      return db.post.update({
        ...query,
        where: { id: Number(args.id) },
        data: {
          title: args.input.title ?? undefined,
          description: args.input.description ?? undefined,
          image: args.input.image ?? undefined,
        },
      });
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
      if (!ctx.user) throw new Error("Unauthorized");

      const post = await db.post.findUnique({
        where: { id: Number(args.id) },
      });

      if (!post) throw new Error("Post not found");

      return db.post.delete({
        ...query,
        where: { id: Number(args.id) },
      });
    },
  }),
);
