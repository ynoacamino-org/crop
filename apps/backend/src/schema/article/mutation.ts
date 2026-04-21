import { eq } from "drizzle-orm";
import { builder } from "@/builder";
import {
  articles,
  articleToCategories,
  articleToLegalCases,
  articleToTags,
} from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { CreateArticleInput, UpdateArticleInput } from "./inputs";

builder.mutationField("createArticle", (t) =>
  t.field({
    type: "Article",
    authScopes: { authenticated: true },
    args: {
      input: t.arg({
        type: CreateArticleInput,
        required: true,
        description: "Data for creating a new article",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      const currentUser = ctx.user;

      if (!currentUser) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        return await db.transaction(async (tx) => {
          const [createdArticle] = await tx
            .insert(articles)
            .values({
              title: input.title,
              slug: input.slug,
              excerpt: input.excerpt,
              content: input.content,
              status:
                (input.status as typeof articles.$inferInsert.status) ||
                "DRAFT",
              publishedAt: input.publishedAt
                ? new Date(input.publishedAt)
                : null,
              readingTimeMin: input.readingTimeMin,
              authorId: currentUser.id,
              ...(input.featuredImageId && {
                featuredImageId: input.featuredImageId,
              }),
            })
            .returning();

          if (!createdArticle) {
            throw new Error("No se pudo crear el artículo");
          }

          if (input.categoryIds?.length) {
            await tx.insert(articleToCategories).values(
              input.categoryIds.map((categoryId) => ({
                articleId: createdArticle.id,
                categoryId,
              })),
            );
          }

          if (input.tagIds?.length) {
            await tx.insert(articleToTags).values(
              input.tagIds.map((tagId) => ({
                articleId: createdArticle.id,
                tagId,
              })),
            );
          }

          if (input.legalCaseIds?.length) {
            await tx.insert(articleToLegalCases).values(
              input.legalCaseIds.map((legalCaseId) => ({
                articleId: createdArticle.id,
                legalCaseId,
              })),
            );
          }

          return createdArticle;
        });
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un artículo con el mismo slug",
        });
      }
    },
  }),
);

builder.mutationField("updateArticle", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      try {
        const [article] = await db
          .select({ authorId: articles.authorId })
          .from(articles)
          .where(eq(articles.id, id))
          .limit(1);

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        if (article.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        return await db.transaction(async (tx) => {
          const [updatedArticle] = await tx
            .update(articles)
            .set({
              ...(input.title && { title: input.title }),
              ...(input.slug && { slug: input.slug }),
              ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
              ...(input.content && { content: input.content }),
              ...(input.status && {
                status: input.status as typeof articles.$inferInsert.status,
              }),
              ...(input.publishedAt !== undefined && {
                publishedAt: input.publishedAt
                  ? new Date(input.publishedAt)
                  : null,
              }),
              ...(input.readingTimeMin !== undefined && {
                readingTimeMin: input.readingTimeMin,
              }),
              ...(input.featuredImageId !== undefined && {
                featuredImageId: input.featuredImageId,
              }),
              updatedAt: new Date(),
            })
            .where(eq(articles.id, id))
            .returning();

          if (!updatedArticle) {
            throw new NotFoundError("Artículo no encontrado");
          }

          if (input.categoryIds !== undefined) {
            await tx
              .delete(articleToCategories)
              .where(eq(articleToCategories.articleId, id));

            if (input.categoryIds.length) {
              await tx.insert(articleToCategories).values(
                input.categoryIds.map((categoryId) => ({
                  articleId: id,
                  categoryId,
                })),
              );
            }
          }

          if (input.tagIds !== undefined) {
            await tx
              .delete(articleToTags)
              .where(eq(articleToTags.articleId, id));

            if (input.tagIds.length) {
              await tx.insert(articleToTags).values(
                input.tagIds.map((tagId) => ({
                  articleId: id,
                  tagId,
                })),
              );
            }
          }

          if (input.legalCaseIds !== undefined) {
            await tx
              .delete(articleToLegalCases)
              .where(eq(articleToLegalCases.articleId, id));

            if (input.legalCaseIds.length) {
              await tx.insert(articleToLegalCases).values(
                input.legalCaseIds.map((legalCaseId) => ({
                  articleId: id,
                  legalCaseId,
                })),
              );
            }
          }

          return updatedArticle;
        });
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un artículo con el mismo slug",
        });
      }
    },
  }),
);

builder.mutationField("deleteArticle", (t) =>
  t.field({
    type: "Article",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Article ID to delete",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const [article] = await db
          .select({ authorId: articles.authorId })
          .from(articles)
          .where(eq(articles.id, id))
          .limit(1);

        if (!article) {
          throw new NotFoundError("Artículo no encontrado");
        }

        if (article.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
          throw new UnauthorizedError();
        }

        const [deletedArticle] = await db
          .delete(articles)
          .where(eq(articles.id, id))
          .returning();

        if (!deletedArticle) {
          throw new NotFoundError("Artículo no encontrado");
        }

        return deletedArticle;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
