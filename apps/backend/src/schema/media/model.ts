import { getMediaSignedUrl } from "@/application/media";
import { builder } from "@/builder";

export const MediaType = builder.enumType("MediaType", {
  values: ["IMAGE", "VIDEO", "AUDIO", "FILE"] as const,
});

export const Media = builder.drizzleObject("media", {
  name: "Media",
  fields: (t) => ({
    id: t.exposeID("id"),
    objectKey: t.exposeString("objectKey"),
    url: t.string({
      nullable: false,
      resolve: async (media, _args, ctx) => {
        if (media.url) {
          return media.url;
        }
        return getMediaSignedUrl(ctx.runtime, media.objectKey, 3600);
      },
    }),
    alt: t.exposeString("alt", { nullable: true }),
    type: t.expose("type", { type: MediaType }),
    size: t.exposeInt("size"),
    mimeType: t.exposeString("mimeType"),
    filename: t.exposeString("filename"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    uploader: t.relation("uploader"),
  }),
});
