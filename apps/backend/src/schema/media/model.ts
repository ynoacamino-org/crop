import { builder } from "@/builder";

export const MediaType = builder.enumType("MediaType", {
  values: ["IMAGE", "VIDEO", "AUDIO"] as const,
});

export const Media = builder.prismaObject("Media", {
  fields: (t) => ({
    id: t.exposeID("id"),
    objectKey: t.exposeString("objectKey"),
    url: t.exposeString("url"),
    alt: t.exposeString("alt", { nullable: true }),
    type: t.expose("type", { type: MediaType }),
    size: t.exposeInt("size"),
    mimeType: t.exposeString("mimeType"),
    filename: t.exposeString("filename"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    uploader: t.relation("uploader", {
      nullable: true,
    }),
  }),
});
