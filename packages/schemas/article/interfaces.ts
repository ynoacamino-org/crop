import type { z } from "zod";
import type {
	ArticleStatus,
	createArticleSchema,
	updateArticleSchema,
} from "./schemas";

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleStatusType = z.infer<typeof ArticleStatus>;
