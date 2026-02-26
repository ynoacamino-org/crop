import { builder } from "@/builder";
import { getMediaSignedUrl } from "@/lib/utils/storage";

export const MediaType = builder.enumType("MediaType", {
  values: ["IMAGE", "VIDEO", "AUDIO", "FILE"] as const,
});

export const Media = builder.prismaObject("Media", {
  fields: (t) => ({
    id: t.exposeID("id"),
    objectKey: t.exposeString("objectKey"),
    url: t.string({
      nullable: false,
      resolve: async (media) => {
        if (media.url) {
          return media.url;
        }
        return getMediaSignedUrl(media.objectKey, 3600);
      },
    }),
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
