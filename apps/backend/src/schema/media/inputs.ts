import {
  CreateMediaPayloadSchema,
  MediaTypeEnum,
  UpdateMediaPayloadSchema,
} from "@repo/schemas/media";
import { builder } from "@/builder";

export const CreateMediaInput = builder.inputType("CreateMediaInput", {
  fields: (t) => ({
    objectKey: t.string({
      required: true,
      description: "Unique ID in the storage bucket",
      validate: CreateMediaPayloadSchema.shape.input.shape.objectKey,
    }),
    url: t.string({
      required: true,
      description: "CDN URL of the media",
      validate: CreateMediaPayloadSchema.shape.input.shape.url,
    }),
    alt: t.string({
      required: false,
      description: "Alternative text for the media",
      validate: CreateMediaPayloadSchema.shape.input.shape.alt,
    }),
    type: t.string({
      required: true,
      description: "Type of media: IMAGE, VIDEO, or AUDIO",
      validate: MediaTypeEnum,
    }),
    size: t.int({
      required: true,
      description: "Size of the file in bytes",
      validate: CreateMediaPayloadSchema.shape.input.shape.size,
    }),
    mimeType: t.string({
      required: true,
      description: "MIME type of the file",
      validate: CreateMediaPayloadSchema.shape.input.shape.mimeType,
    }),
    filename: t.string({
      required: true,
      description: "Original filename",
      validate: CreateMediaPayloadSchema.shape.input.shape.filename,
    }),
  }),
});

export const UpdateMediaInput = builder.inputType("UpdateMediaInput", {
  fields: (t) => ({
    alt: t.string({
      required: false,
      description: "Alternative text for the media",
      validate: UpdateMediaPayloadSchema.shape.input.shape.alt,
    }),
    url: t.string({
      required: false,
      description: "CDN URL of the media",
      validate: UpdateMediaPayloadSchema.shape.input.shape.url,
    }),
  }),
});
