import { Role } from "@prisma/client/enums";
import { UpdateMePayloadSchema, UpdateUserPayloadSchema } from "@repo/schemas";
import { builder } from "@/builder";

export const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Name of the user",
      validate: UpdateMePayloadSchema.shape.input.shape.name,
    }),
    image: t.string({
      required: false,
      description: "Profile image URL of the user",
      validate: UpdateMePayloadSchema.shape.input.shape.image,
    }),
  }),
});

export const AdminUpdateUserInput = builder.inputType("AdminUpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Name of the user",
      validate: UpdateUserPayloadSchema.shape.input.shape.name,
    }),
    image: t.string({
      required: false,
      description: "Profile image URL of the user",
      validate: UpdateUserPayloadSchema.shape.input.shape.image,
    }),
    role: t.field({
      type: Role,
      required: false,
      description: "Role of the user (admin only)",
      validate: UpdateUserPayloadSchema.shape.input.shape.role,
    }),
  }),
});
