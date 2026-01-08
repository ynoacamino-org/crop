import {
  CreatePostPayloadSchema,
  DeletePostPayloadSchema,
  PostPayloadSchema,
  PostsPayloadSchema,
  UpdatePostPayloadSchema,
} from "@repo/schemas";
import { GraphQLError } from "graphql";
import { Prisma } from "../../prisma/client/client";
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
        validate: PostsPayloadSchema.shape.take,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of posts to skip",
        defaultValue: 0,
        validate: PostsPayloadSchema.shape.skip,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for post title or description",
        validate: PostsPayloadSchema.shape.search,
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
      id: t.arg.id({
        required: true,
        description: "ID of the post",
        validate: PostPayloadSchema.shape.id,
      }),
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
      if (!ctx.user) {
        throw new GraphQLError("No estás autenticado", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      const post = await db.post.findUnique({
        where: { id: Number(args.id) },
      });

      if (!post) {
        throw new GraphQLError("El post que intestas modificar no existe.", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      try {
        return db.post.update({
          ...query,
          where: { id: Number(args.id) },
          data: {
            title: args.input.title ?? undefined,
            description: args.input.description ?? undefined,
            image: args.input.image ?? undefined,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            const campos = (error.meta?.target as string[])?.join(", ");

            throw new GraphQLError(
              `Ya existe un post con el mismo valor en: ${campos}`,
              {
                extensions: {
                  code: "DUPLICATE_FIELD",
                  fields: campos,
                },
              },
            );
          }
        }

        throw new GraphQLError("Error interno del servidor", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
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
