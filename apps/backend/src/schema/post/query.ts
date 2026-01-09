import { handlePrismaError } from "@prisma/lib/error-handler";
import { PostPayloadSchema, PostsPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";
import { sanitize } from "@/lib/sanitize";

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
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.post.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
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
      } catch (error) {
        handlePrismaError(error);
      }
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
      try {
        return await db.post.findUnique({
          ...query,
          where: { id: args.id },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "El post solicitado no existe",
        });
      }
    },
  }),
);
