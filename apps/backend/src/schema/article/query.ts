import type { ArticleStatus } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("articles", (t) =>
  t.prismaField({
    type: ["Article"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of articles to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of articles to skip",
        defaultValue: 0,
      }),
      status: t.arg.string({
        required: false,
        description: "Filter by status",
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for title or content",
      }),
      authorId: t.arg.string({
        required: false,
        description: "Filter by author ID",
      }),
      categoryId: t.arg.string({
        required: false,
        description: "Filter by category ID",
      }),
      tagId: t.arg.string({
        required: false,
        description: "Filter by tag ID",
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.article.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
          where: {
            ...(args.status && {
              status: args.status as ArticleStatus,
            }),
            ...(args.authorId && {
              authorId: args.authorId,
            }),
            ...(args.categoryId && {
              categories: {
                some: {
                  id: args.categoryId,
                },
              },
            }),
            ...(args.tagId && {
              tags: {
                some: {
                  id: args.tagId,
                },
              },
            }),
            ...(args.search && {
              OR: [
                { title: { contains: args.search, mode: "insensitive" } },
                { content: { contains: args.search, mode: "insensitive" } },
                { excerpt: { contains: args.search, mode: "insensitive" } },
              ],
            }),
          },
          orderBy: {
            publishedAt: "desc",
          },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);

builder.queryField("article", (t) =>
  t.prismaField({
    type: "Article",
    args: {
      id: t.arg.string({
        required: false,
        description: "Article ID",
      }),
      slug: t.arg.string({
        required: false,
        description: "Article slug",
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug) {
        throw new NotFoundError("Se debe proporcionar id o slug");
      }

      try {
        const article = await db.article.findFirst({
          ...query,
          where: args.id ? { id: args.id } : { slug: args.slug },
        });

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        return article;
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);

builder.queryField("categories", (t) =>
  t.prismaField({
    type: ["Category"],
    resolve: async (query) => {
      return await db.category.findMany({
        ...query,
        orderBy: {
          name: "asc",
        },
      });
    },
  }),
);

builder.queryField("tags", (t) =>
  t.prismaField({
    type: ["Tag"],
    resolve: async (query) => {
      return await db.tag.findMany({
        ...query,
        orderBy: {
          name: "asc",
        },
      });
    },
  }),
);
