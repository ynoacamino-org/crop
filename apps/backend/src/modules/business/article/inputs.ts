import {
  createArticleSchema,
  updateArticleSchema,
} from "@repo/schemas/article";
import { builder } from "@/shared/graphql/builder";
import {
  DateTimeFilter,
  IntFilter,
  StringFilter,
} from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const CreateArticleInput = builder.inputType("CreateArticleInput", {
  fields: (t) => ({
    title: t.string({
      required: true,
      description: "Title of the article",
    }),
    slug: t.string({
      required: true,
      description: "URL-friendly slug",
    }),
    excerpt: t.string({
      required: false,
      description: "Short summary of the article",
    }),
    content: t.string({
      required: true,
      description: "Full content of the article (Markdown/HTML)",
    }),
    status: t.string({
      required: false,
      description: "Article status: DRAFT, PUBLISHED, or ARCHIVED",
    }),
    readingTimeMin: t.int({
      required: false,
      description: "Estimated reading time in minutes",
    }),
    featuredImageId: t.string({
      required: false,
      description: "ID of the featured image media",
    }),
    categoryIds: t.stringList({
      required: false,
      description: "Array of category IDs",
    }),
    tagIds: t.stringList({
      required: false,
      description: "Array of tag IDs",
    }),
    legalCaseIds: t.stringList({
      required: false,
      description: "Array of related legal case IDs",
    }),
    publishedAt: t.string({
      required: false,
      description: "Publication date (ISO 8601 datetime string)",
    }),
  }),
  validate: createArticleSchema,
});

export const UpdateArticleInput = builder.inputType("UpdateArticleInput", {
  fields: (t) => ({
    title: t.string({
      required: false,
      description: "Title of the article",
    }),
    slug: t.string({
      required: false,
      description: "URL-friendly slug",
    }),
    excerpt: t.string({
      required: false,
      description: "Short summary of the article",
    }),
    content: t.string({
      required: false,
      description: "Full content of the article",
    }),
    status: t.string({
      required: false,
      description: "Article status: DRAFT, PUBLISHED, or ARCHIVED",
    }),
    readingTimeMin: t.int({
      required: false,
      description: "Estimated reading time in minutes",
    }),
    featuredImageId: t.string({
      required: false,
      description: "ID of the featured image media",
    }),
    categoryIds: t.stringList({
      required: false,
      description: "Array of category IDs",
    }),
    tagIds: t.stringList({
      required: false,
      description: "Array of tag IDs",
    }),
    legalCaseIds: t.stringList({
      required: false,
      description: "Array of related legal case IDs",
    }),
    publishedAt: t.string({
      required: false,
      description: "Publication date (ISO 8601 datetime string)",
    }),
  }),
  validate: updateArticleSchema,
});

export const ArticleFilter = builder.inputType("ArticleFilter", {
  description: "Filter articles by various fields",
  fields: (t) => ({
    title: t.field({ type: StringFilter, description: "Filter by title" }),
    slug: t.field({ type: StringFilter, description: "Filter by slug" }),
    content: t.field({ type: StringFilter, description: "Filter by content" }),
    excerpt: t.field({ type: StringFilter, description: "Filter by excerpt" }),
    authorId: t.field({
      type: StringFilter,
      description: "Filter by author ID",
    }),
    status: t.field({
      type: StringFilter,
      description: "Filter by status (DRAFT, PUBLISHED, ARCHIVED)",
    }),
    publishedAt: t.field({
      type: DateTimeFilter,
      description: "Filter by publication date",
    }),
    readingTimeMin: t.field({
      type: IntFilter,
      description: "Filter by reading time",
    }),
  }),
});

export const ArticleSortField = builder.enumType("ArticleSortField", {
  description: "Fields to sort articles by",
  values: [
    "TITLE",
    "SLUG",
    "STATUS",
    "PUBLISHED_AT",
    "CREATED_AT",
    "READING_TIME_MIN",
  ] as const,
});

export const ArticleSort = builder.inputType("ArticleSort", {
  description: "Sort configuration for articles",
  fields: (t) => ({
    field: t.field({
      type: ArticleSortField,
      required: true,
      description: "Field to sort by",
    }),
    direction: t.field({
      type: SortDirection,
      required: true,
      description: "Sort direction",
    }),
  }),
});

export const ARTICLE_SORT_FIELD_MAP: Record<string, string> = {
  TITLE: "title",
  SLUG: "slug",
  STATUS: "status",
  PUBLISHED_AT: "publishedAt",
  CREATED_AT: "createdAt",
  READING_TIME_MIN: "readingTimeMin",
};

export const ARTICLE_ENUM_FIELDS = new Set(["status"]);
