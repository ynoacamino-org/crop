import { builder } from "@/builder";

export const CreateArticleInput = builder.inputType("CreateArticleInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    slug: t.string({ required: true }),
    excerpt: t.string({ required: false }),
    content: t.string({ required: true }),
    status: t.string({ required: false }),
    publishedAt: t.field({ type: "DateTime", required: false }),
    readingTimeMin: t.int({ required: false }),
    featuredImageId: t.string({ required: false }),
    categoryIds: t.stringList({ required: false }),
    tagIds: t.stringList({ required: false }),
    legalCaseIds: t.stringList({ required: false }),
  }),
});

export const UpdateArticleInput = builder.inputType("UpdateArticleInput", {
  fields: (t) => ({
    title: t.string({ required: false }),
    slug: t.string({ required: false }),
    excerpt: t.string({ required: false }),
    content: t.string({ required: false }),
    status: t.string({ required: false }),
    publishedAt: t.field({ type: "DateTime", required: false }),
    readingTimeMin: t.int({ required: false }),
    featuredImageId: t.string({ required: false }),
    categoryIds: t.stringList({ required: false }),
    tagIds: t.stringList({ required: false }),
    legalCaseIds: t.stringList({ required: false }),
  }),
});
