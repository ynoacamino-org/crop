import { createArticleSchema, updateArticleSchema } from "@repo/schemas";
import { builder } from "@/shared/graphql/builder";

export const CreateArticleInput = builder.inputType("CreateArticleInput", {
  fields: (t) => ({
    title: t.string({
      required: true,
      description: "Title of the article",
      validate: createArticleSchema.shape.title,
    }),
    slug: t.string({
      required: true,
      description: "URL-friendly slug",
      validate: createArticleSchema.shape.slug,
    }),
    excerpt: t.string({
      required: false,
      description: "Short summary of the article",
      validate: createArticleSchema.shape.excerpt,
    }),
    content: t.string({
      required: true,
      description: "Full content of the article (Markdown/HTML)",
      validate: createArticleSchema.shape.content,
    }),
    status: t.string({
      required: false,
      description: "Article status: DRAFT, PUBLISHED, or ARCHIVED",
      validate: createArticleSchema.shape.status,
    }),
    readingTimeMin: t.int({
      required: false,
      description: "Estimated reading time in minutes",
      validate: createArticleSchema.shape.readingTimeMin,
    }),
    featuredImageId: t.string({
      required: false,
      description: "ID of the featured image media",
      validate: createArticleSchema.shape.featuredImageId,
    }),
    categoryIds: t.stringList({
      required: false,
      description: "Array of category IDs",
      validate: createArticleSchema.shape.categoryIds,
    }),
    tagIds: t.stringList({
      required: false,
      description: "Array of tag IDs",
      validate: createArticleSchema.shape.tagIds,
    }),
    legalCaseIds: t.stringList({
      required: false,
      description: "Array of related legal case IDs",
      validate: createArticleSchema.shape.legalCaseIds,
    }),
    publishedAt: t.string({
      required: false,
      description: "Publication date (ISO 8601 datetime string)",
      validate: createArticleSchema.shape.publishedAt,
    }),
  }),
});

export const UpdateArticleInput = builder.inputType("UpdateArticleInput", {
  fields: (t) => ({
    title: t.string({
      required: false,
      description: "Title of the article",
      validate: updateArticleSchema.shape.title,
    }),
    slug: t.string({
      required: false,
      description: "URL-friendly slug",
      validate: updateArticleSchema.shape.slug,
    }),
    excerpt: t.string({
      required: false,
      description: "Short summary of the article",
      validate: updateArticleSchema.shape.excerpt,
    }),
    content: t.string({
      required: false,
      description: "Full content of the article",
      validate: updateArticleSchema.shape.content,
    }),
    status: t.string({
      required: false,
      description: "Article status: DRAFT, PUBLISHED, or ARCHIVED",
      validate: updateArticleSchema.shape.status,
    }),
    readingTimeMin: t.int({
      required: false,
      description: "Estimated reading time in minutes",
      validate: updateArticleSchema.shape.readingTimeMin,
    }),
    featuredImageId: t.string({
      required: false,
      description: "ID of the featured image media",
      validate: updateArticleSchema.shape.featuredImageId,
    }),
    categoryIds: t.stringList({
      required: false,
      description: "Array of category IDs",
      validate: updateArticleSchema.shape.categoryIds,
    }),
    tagIds: t.stringList({
      required: false,
      description: "Array of tag IDs",
      validate: updateArticleSchema.shape.tagIds,
    }),
    legalCaseIds: t.stringList({
      required: false,
      description: "Array of related legal case IDs",
      validate: updateArticleSchema.shape.legalCaseIds,
    }),
    publishedAt: t.string({
      required: false,
      description: "Publication date (ISO 8601 datetime string)",
      validate: updateArticleSchema.shape.publishedAt,
    }),
  }),
});
