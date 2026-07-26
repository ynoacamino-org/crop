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
import {
  buildDrizzleOrderBy,
  buildDrizzleSqlWhere,
  buildDrizzleWhere,
} from "@/shared/graphql/filters";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

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

interface ArticlesConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

const ArticlesConnection =
  builder.objectRef<ArticlesConnectionShape>("ArticlesConnection");

ArticlesConnection.implement({
  description: "Paginated list of articles",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["articles"],
      resolve: async (query, parent, _args, ctx) => {
        try {
          return await ctx.db.query.articles.findMany(
            query({
              where: buildDrizzleWhere(parent.filter, ARTICLE_ENUM_FIELDS),
              orderBy: buildDrizzleOrderBy(parent.sort, ARTICLE_SORT_FIELD_MAP),
              limit: parent.take,
              offset: parent.skip,
            }),
          );
        } catch (error) {
          handleDbError(error);
        }
      },
    }),
    pageInfo: t.field({
      type: PaginationInfo,
      resolve: createDbCountPageInfoResolver<ArticlesConnectionShape>({
        source: articles,
        where: (parent) =>
          buildDrizzleSqlWhere(
            parent.filter,
            ARTICLE_COLUMNS,
            ARTICLE_ENUM_FIELDS,
          ),
        onError: handleDbError,
      }),
    }),
  }),
});

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
      filter: t.arg({
        type: ArticleFilter,
        required: false,
        description: "Filter articles by fields",
      }),
      sort: t.arg({
        type: [ArticleSort],
        required: false,
        description: "Sort articles by fields",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        filter: args.filter ?? undefined,
        sort: args.sort ?? undefined,
      };
    },
  }),
);

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
