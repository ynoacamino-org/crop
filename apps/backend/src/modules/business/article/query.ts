import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { articles } from "@/domain/db/schema";
import {
  ARTICLE_ENUM_FIELDS,
  ARTICLE_SORT_FIELD_MAP,
  ArticleFilter,
  ArticleSort,
} from "@/modules/business/article/inputs";
import { builder } from "@/shared/graphql/builder";
import { createConnectionType } from "@/shared/graphql/connection";

const ARTICLE_COLUMNS = {
  title: articles.title,
  slug: articles.slug,
  content: articles.content,
  excerpt: articles.excerpt,
  authorId: articles.authorId,
  status: articles.status,
  publishedAt: articles.publishedAt,
  readingTimeMin: articles.readingTimeMin,
};

const { listQuery } = createConnectionType({
  typeName: "ArticlesConnection",
  description: "Paginated list of articles",
  table: articles,
  itemType: "articles",
  filterInput: ArticleFilter,
  sortInput: ArticleSort,
  enumFields: ARTICLE_ENUM_FIELDS,
  fieldMap: ARTICLE_SORT_FIELD_MAP,
  columns: ARTICLE_COLUMNS,
});

listQuery("articles", "Get all articles with pagination");

builder.queryField("article", (t) =>
  t.drizzleField({
    type: "articles",
    nullable: true,
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
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug) {
        throw new NotFoundError("Se debe proporcionar id o slug");
      }

      try {
        const article = await ctx.db.query.articles.findFirst(
          query({
            where: args.id ? { id: args.id } : { slug: args.slug as string },
          }),
        );

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
  t.drizzleField({
    type: ["categories"],
    resolve: async (query, _root, _args, ctx) => {
      return await ctx.db.query.categories.findMany(
        query({
          orderBy: {
            name: "asc",
          },
        }),
      );
    },
  }),
);

builder.queryField("tags", (t) =>
  t.drizzleField({
    type: ["tags"],
    resolve: async (query, _root, _args, ctx) => {
      return await ctx.db.query.tags.findMany(
        query({
          orderBy: {
            name: "asc",
          },
        }),
      );
    },
  }),
);
