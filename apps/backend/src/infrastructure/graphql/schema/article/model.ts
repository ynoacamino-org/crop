import { builder } from "@/infrastructure/graphql/builder";

export const ArticleStatus = builder.enumType("ArticleStatus", {
  values: ["DRAFT", "PUBLISHED", "ARCHIVED"] as const,
});

export const Article = builder.drizzleObject("articles", {
  name: "Article",
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    slug: t.exposeString("slug"),
    excerpt: t.exposeString("excerpt", { nullable: true }),
    content: t.exposeString("content"),
    status: t.expose("status", { type: ArticleStatus }),
    publishedAt: t.expose("publishedAt", { type: "DateTime", nullable: true }),
    views: t.exposeInt("views"),
    readingTimeMin: t.exposeInt("readingTimeMin", { nullable: true }),
    author: t.relation("author"),
    featuredImage: t.relation("featuredImage"),
    attachments: t.relation("attachments"),
    categories: t.relation("categories"),
    tags: t.relation("tags"),
    legalCases: t.relation("legalCases"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export const Category = builder.drizzleObject("categories", {
  name: "Category",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    description: t.exposeString("description", { nullable: true }),
    articles: t.relation("articles"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export const Tag = builder.drizzleObject("tags", {
  name: "Tag",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    articles: t.relation("articles"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
