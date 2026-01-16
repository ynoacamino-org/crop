import { builder } from "@/builder";

export const Post = builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    author: t.relation("author", {
      nullable: false,
    }),
    media: t.relation("media", {
      nullable: true,
    }),
  }),
});
