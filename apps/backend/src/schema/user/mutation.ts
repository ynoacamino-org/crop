import { Role } from "@prisma/client/enums";
import {
  DeleteUserPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";

const UpdateUserInput = builder.inputType("UpdateUserInput", {
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

const AdminUpdateUserInput = builder.inputType("AdminUpdateUserInput", {
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

builder.mutationField("updateMe", (t) =>
  t.prismaField({
    type: "User",
    args: {
      input: t.arg({ type: UpdateUserInput, required: true }),
    },
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, { input }, ctx) => {
      if (!ctx.user) throw new Error("Not authenticated");

      return db.user.update({
        ...query,
        where: { id: ctx.user.id },
        data: {
          name: input.name ?? undefined,
          image: input.image ?? undefined,
        },
      });
    },
  }),
);

builder.mutationField("updateUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({
        required: true,
        validate: UpdateUserPayloadSchema.shape.id,
      }),
      input: t.arg({ type: AdminUpdateUserInput, required: true }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id, input }) => {
      return db.user.update({
        ...query,
        where: { id: id },
        data: {
          name: input.name ?? undefined,
          image: input.image ?? undefined,
          role: input.role ?? undefined,
        },
      });
    },
  }),
);

builder.mutationField("deleteMe", (t) =>
  t.prismaField({
    type: "User",
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user) throw new Error("Not authenticated");

      return db.user.delete({
        ...query,
        where: { id: ctx.user.id },
      });
    },
  }),
);

builder.mutationField("deleteUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({
        required: true,
        validate: DeleteUserPayloadSchema.shape.id,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id }) => {
      return db.user.delete({
        ...query,
        where: { id },
      });
    },
  }),
);
