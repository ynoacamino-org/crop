import type { ArticleStatus } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { CreateArticleInput, UpdateArticleInput } from "./inputs";

builder.mutationField("createArticle", (t) =>
  t.prismaField({
    type: "Article",
    authScopes: { authenticated: true },
    args: {
      input: t.arg({
        type: CreateArticleInput,
        required: true,
        description: "Data for creating a new article",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        return await db.article.create({
          ...query,
          data: {
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            status: (input.status as ArticleStatus) || "DRAFT",
            publishedAt: input.publishedAt,
            readingTimeMin: input.readingTimeMin,
            authorId: ctx.user.id,
            ...(input.featuredImageId && {
              featuredImageId: input.featuredImageId,
            }),
            ...(input.categoryIds && {
              categories: {
                connect: input.categoryIds.map((id) => ({ id })),
              },
            }),
            ...(input.tagIds && {
              tags: {
                connect: input.tagIds.map((id) => ({ id })),
              },
            }),
            ...(input.legalCaseIds && {
              legalCases: {
                connect: input.legalCaseIds.map((id) => ({ id })),
              },
            }),
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un artículo con el mismo slug",
        });
      }
    },
  }),
);

builder.mutationField("updateArticle", (t) =>
  t.prismaField({
    type: "Article",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Article ID to update",
      }),
      input: t.arg({
        type: UpdateArticleInput,
        required: true,
        description: "Data for updating the article",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      try {
        const article = await db.article.findUnique({
          where: { id },
          select: { authorId: true },
        });

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        if (article.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        return await db.article.update({
          ...query,
          where: { id },
          data: {
            ...(input.title && { title: input.title }),
            ...(input.slug && { slug: input.slug }),
            ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
            ...(input.content && { content: input.content }),
            ...(input.status && { status: input.status as ArticleStatus }),
            ...(input.publishedAt !== undefined && {
              publishedAt: input.publishedAt,
            }),
            ...(input.readingTimeMin !== undefined && {
              readingTimeMin: input.readingTimeMin,
            }),
            ...(input.featuredImageId !== undefined && {
              featuredImageId: input.featuredImageId,
            }),
            ...(input.categoryIds && {
              categories: {
                set: input.categoryIds.map((id) => ({ id })),
              },
            }),
            ...(input.tagIds && {
              tags: {
                set: input.tagIds.map((id) => ({ id })),
              },
            }),
            ...(input.legalCaseIds && {
              legalCases: {
                set: input.legalCaseIds.map((id) => ({ id })),
              },
            }),
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un artículo con el mismo slug",
        });
      }
    },
  }),
);

builder.mutationField("deleteArticle", (t) =>
  t.prismaField({
    type: "Article",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Article ID to delete",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const article = await db.article.findUnique({
          where: { id },
          select: { authorId: true },
        });

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        if (article.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        return await db.article.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
