import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { builder } from "@/builder";
import {
  articles,
  articleToCategories,
  articleToTags,
  categories,
  tags,
} from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
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

      try {
        let allowedArticleIds: string[] | undefined;

        if (args.categoryId) {
          const categoryArticleRows = await db
            .select({ articleId: articleToCategories.articleId })
            .from(articleToCategories)
            .where(eq(articleToCategories.categoryId, args.categoryId));

          allowedArticleIds = categoryArticleRows.map((row) => row.articleId);
        }

        if (args.tagId) {
          const tagArticleRows = await db
            .select({ articleId: articleToTags.articleId })
            .from(articleToTags)
            .where(eq(articleToTags.tagId, args.tagId));
          const tagArticleIds = new Set(
            tagArticleRows.map((row) => row.articleId),
          );

          allowedArticleIds = (
            allowedArticleIds ?? tagArticleRows.map((row) => row.articleId)
          ).filter((id) => tagArticleIds.has(id));
        }

        if (allowedArticleIds && allowedArticleIds.length === 0) {
          return {
            items: [],
            pageInfo: calculatePaginationInfo({
              totalCount: 0,
              take: args.take ?? 10,
              skip: args.skip ?? 0,
            }),
          };
        }

        const conditions = [
          args.status
            ? eq(
                articles.status,
                args.status as typeof articles.$inferSelect.status,
              )
            : undefined,
          args.authorId ? eq(articles.authorId, args.authorId) : undefined,
          allowedArticleIds
            ? inArray(articles.id, allowedArticleIds)
            : undefined,
          args.search
            ? or(
                ilike(articles.title, `%${args.search}%`),
                ilike(articles.content, `%${args.search}%`),
                ilike(articles.excerpt, `%${args.search}%`),
              )
            : undefined,
        ].filter((condition): condition is NonNullable<typeof condition> =>
          Boolean(condition),
        );

        const whereClause = conditions.length ? and(...conditions) : undefined;

        const [items, totalCountRows] = await Promise.all([
          db
            .select()
            .from(articles)
            .where(whereClause)
            .orderBy(desc(articles.publishedAt))
            .limit(args.take ?? 10)
            .offset(args.skip ?? 0),
          db
            .select({ totalCount: sql<number>`count(*)::int` })
            .from(articles)
            .where(whereClause),
        ]);

        const totalCount = totalCountRows[0]?.totalCount ?? 0;

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
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("article", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug) {
        throw new NotFoundError("Se debe proporcionar id o slug");
      }

      try {
        const [article] = await db
          .select()
          .from(articles)
          .where(
            args.id
              ? eq(articles.id, args.id)
              : eq(articles.slug, args.slug as string),
          )
          .limit(1);

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        return article;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("categories", (t) =>
  t.field({
    type: ["Category"],
    resolve: async () => {
      return await db.select().from(categories).orderBy(asc(categories.name));
    },
  }),
);

builder.queryField("tags", (t) =>
  t.field({
    type: ["Tag"],
    resolve: async () => {
      return await db.select().from(tags).orderBy(asc(tags.name));
    },
  }),
);
