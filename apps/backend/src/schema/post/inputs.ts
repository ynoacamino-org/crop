import {
  CreatePostPayloadSchema,
  UpdatePostPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";

export const CreatePostInput = builder.inputType("CreatePostInput", {
  fields: (t) => ({
    title: t.string({
      required: true,
      description: "Title of the post",
      validate: CreatePostPayloadSchema.shape.input.shape.title,
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: CreatePostPayloadSchema.shape.input.shape.description,
    }),
    mediaId: t.string({
      required: false,
      description: "Media ID for the post",
      validate: CreatePostPayloadSchema.shape.input.shape.mediaId,
    }),
  }),
});

export const UpdatePostInput = builder.inputType("UpdatePostInput", {
  fields: (t) => ({
    title: t.string({
      required: false,
      description: "Title of the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.title,
    }),
    description: t.string({
      required: false,
      description: "Description of the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.description,
    }),
    mediaId: t.string({
      required: false,
      description: "Media ID for the post",
      validate: UpdatePostPayloadSchema.shape.input.shape.mediaId,
    }),
  }),
});
