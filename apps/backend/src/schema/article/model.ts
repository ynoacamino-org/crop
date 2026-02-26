import { builder } from "@/builder";

export const ArticleStatus = builder.enumType("ArticleStatus", {
  values: ["DRAFT", "PUBLISHED", "ARCHIVED"] as const,
});

export const Article = builder.prismaObject("Article", {
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
    featuredImage: t.relation("featuredImage", {
      nullable: true,
    }),
    attachments: t.relation("attachments", {
      nullable: false,
    }),
    categories: t.relation("categories", {
      nullable: false,
    }),
    tags: t.relation("tags", {
      nullable: false,
    }),
    legalCases: t.relation("legalCases", {
      nullable: false,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export const Category = builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    description: t.exposeString("description", { nullable: true }),
    articles: t.relation("articles", {
      nullable: false,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export const Tag = builder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    articles: t.relation("articles", {
      nullable: false,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
