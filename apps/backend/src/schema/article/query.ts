import type { ArticleStatus, Prisma } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import {
  calculatePaginationInfo,
  createPaginatedResponse,
} from "@/schema/pagination/model";

// Create paginated type for articles
const ArticlesConnection = createPaginatedResponse("Articles", "Article");

builder.queryField("articles", (t) =>
  t.field({
    type: ArticlesConnection,
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
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      const whereClause = {
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
            {
              title: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              content: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              excerpt: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }),
      };

      try {
        const [items, totalCount] = await Promise.all([
          db.article.findMany({
            take: args.take,
            skip: args.skip,
            where: whereClause,
            orderBy: {
              publishedAt: "desc",
            },
            include: {
              author: true,
              featuredImage: true,
              categories: true,
              tags: true,
            },
          }),
          db.article.count({
            where: whereClause,
          }),
        ]);

        const pageInfo = calculatePaginationInfo({
          totalCount,
          take: args.take ?? 10,
          skip: args.skip ?? 0,
        });

        return {
          items,
          pageInfo,
        };
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
