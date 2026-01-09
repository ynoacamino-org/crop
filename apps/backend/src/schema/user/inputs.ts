import { Role } from "@prisma/client/enums";
import { UpdateMePayloadSchema, UpdateUserPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";

export const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      validate: UpdateMePayloadSchema.shape.input.shape.name,
    }),
    image: t.string({
      required: false,
      validate: UpdateMePayloadSchema.shape.input.shape.image,
    }),
  }),
});

export const AdminUpdateUserInput = builder.inputType("AdminUpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      validate: UpdateUserPayloadSchema.shape.input.shape.name,
    }),
    image: t.string({
      required: false,
      validate: UpdateUserPayloadSchema.shape.input.shape.image,
    }),
    role: t.field({
      type: Role,
      required: false,
      validate: UpdateUserPayloadSchema.shape.input.shape.role,
    }),
  }),
});
