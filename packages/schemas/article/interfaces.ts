import type { z } from "zod";
import type { ArticleStatus, articlesQuerySchema, createArticleSchema, updateArticleSchema } from "./schemas";

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticlesQueryInput = z.infer<typeof articlesQuerySchema>;
export type ArticleStatusType = z.infer<typeof ArticleStatus>;

export type { ArticleStatus, articlesQuerySchema, createArticleSchema, updateArticleSchema };
