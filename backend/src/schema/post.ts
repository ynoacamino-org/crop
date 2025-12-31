import z from "zod";
import { builder } from "../builder";
import { db } from "../db";

export const Post = builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

builder.queryField("posts", (t) =>
  t.prismaField({
    type: ["Post"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of posts to take",
        defaultValue: 10,
        validate: z.number().min(1).max(100),
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of posts to skip",
        defaultValue: 0,
        validate: z.number().min(0).max(100),
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for post title or description",
        validate: z.string().min(3).max(100),
      }),
    },
    resolve: async (query, _root, args) => {
      return db.post.findMany({
        ...query,
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
        where: args.search
          ? {
              OR: [
                { title: { contains: args.search, mode: "insensitive" } },
                {
                  description: { contains: args.search, mode: "insensitive" },
                },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });
    },
  }),
);

builder.queryField("post", (t) =>
  t.prismaField({
    type: "Post",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args) => {
      return db.post.findUnique({
        ...query,
        where: { id: Number(args.id) },
      });
    },
  }),
);

const CreatePostInput = builder.inputType("CreatePostInput", {
  fields: (t) => ({
    title: t.string({
      required: true,
      description: "Title of the post",
      validate: z.string().min(3).max(100),
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: z.string().max(500),
    }),
    image: t.string({
      required: false,
      description: "Image URL of the post",
      validate: z.url(),
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
          userId: ctx.user.id,
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
      validate: z.string().min(3).max(100),
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: z.string().max(500),
    }),
    image: t.string({
      required: false,
      description: "Image URL of the post",
      validate: z.url(),
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
      }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const post = await db.post.findUnique({
        where: { id: Number(args.id) },
      });

      if (!post) throw new Error("Post not found");
      if (post.userId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new Error("Forbidden: You can only update your own posts");
      }

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
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const post = await db.post.findUnique({
        where: { id: Number(args.id) },
      });

      if (!post) throw new Error("Post not found");
      if (post.userId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new Error("Forbidden: You can only delete your own posts");
      }

      return db.post.delete({
        ...query,
        where: { id: Number(args.id) },
      });
    },
  }),
);
