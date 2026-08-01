import { z } from "zod";

export const ArticleStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createArticleSchema = z.object({
	title: z
		.string({ message: "El título es requerido" })
		.min(5, { message: "El título debe tener al menos 5 caracteres" })
		.max(200, { message: "El título no puede tener más de 200 caracteres" }),
	slug: z
		.string({ message: "El slug es requerido" })
		.min(3, { message: "El slug debe tener al menos 3 caracteres" })
		.max(200, { message: "El slug no puede tener más de 200 caracteres" })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"El slug solo puede contener letras minúsculas, números y guiones",
		}),
	excerpt: z
		.string()
		.max(500, { message: "El extracto no puede tener más de 500 caracteres" })
		.optional(),
	content: z
		.string({ message: "El contenido es requerido" })
		.min(50, { message: "El contenido debe tener al menos 50 caracteres" }),
	status: ArticleStatus.optional(),
	readingTimeMin: z.number().int().positive().optional(),
	featuredImageId: z.string().optional(),
	categoryIds: z.array(z.string()).optional(),
	tagIds: z.array(z.string()).optional(),
	legalCaseIds: z.array(z.string()).optional(),
	publishedAt: z.string().datetime().optional().or(z.literal("")),
});

export const updateArticleSchema = z.object({
	title: createArticleSchema.shape.title.optional(),
	slug: createArticleSchema.shape.slug.optional(),
	excerpt: createArticleSchema.shape.excerpt,
	content: createArticleSchema.shape.content.optional(),
	status: createArticleSchema.shape.status,
	readingTimeMin: createArticleSchema.shape.readingTimeMin,
	featuredImageId: createArticleSchema.shape.featuredImageId.nullable(),
	categoryIds: createArticleSchema.shape.categoryIds,
	tagIds: createArticleSchema.shape.tagIds,
	legalCaseIds: createArticleSchema.shape.legalCaseIds,
	publishedAt: createArticleSchema.shape.publishedAt.nullable(),
});
