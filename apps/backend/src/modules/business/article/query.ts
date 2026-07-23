import { ilike, or } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { articles } from "@/domain/db/schema";
import { builder } from "@/shared/graphql/builder";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

interface ArticlesConnectionShape {
  take: number;
  skip: number;
  search?: string;
}

const ArticlesConnection =
  builder.objectRef<ArticlesConnectionShape>("ArticlesConnection");

ArticlesConnection.implement({
  description: "Paginated list of articles",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["articles"],
      resolve: async (query, parent, _args, ctx) => {
        const search = parent.search?.trim();
        const searchTerm = search ? `%${search}%` : undefined;

        try {
          return await ctx.db.query.articles.findMany(
            query({
              where: searchTerm
                ? {
                    OR: [
                      { title: { ilike: searchTerm } },
                      { content: { ilike: searchTerm } },
                      { excerpt: { ilike: searchTerm } },
                    ],
                  }
                : undefined,
              orderBy: {
                publishedAt: "desc",
              },
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
        where: (parent) => {
          const search = parent.search?.trim();
          const searchTerm = search ? `%${search}%` : undefined;

          return searchTerm
            ? or(
                ilike(articles.title, searchTerm),
                ilike(articles.content, searchTerm),
                ilike(articles.excerpt, searchTerm),
              )
            : undefined;
        },
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
      search: t.arg.string({
        required: false,
        description: "Search term for title or content",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        search: args.search?.trim() || undefined,
      };
    },
  }),
);

builder.queryField("article", (t) =>
  t.drizzleField({
    type: "articles",
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
