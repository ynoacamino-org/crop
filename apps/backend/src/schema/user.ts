import {
  DeleteUserPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
  UsersPayloadSchema,
} from "@repo/schemas";
import { Role } from "../../prisma/client/enums";
import { builder } from "../builder";
import { db } from "../db";

builder.enumType(Role, { name: "Role" });

export const User = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    email: t.exposeString("email"),
    emailVerified: t.exposeBoolean("emailVerified"),
    image: t.exposeString("image", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    role: t.expose("role", { type: Role }),
  }),
});

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: async (_query, _root, _args, ctx) => {
      if (!ctx.user) return null;

      return db.user.findUnique({
        where: { id: ctx.user.id },
      });
    },
    authScopes: {
      collaborator: true,
    },
  }),
);

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of users to take",
        defaultValue: 10,
        validate: UsersPayloadSchema.shape.take,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of users to skip",
        defaultValue: 0,
        validate: UsersPayloadSchema.shape.skip,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for user name or email",
        validate: UsersPayloadSchema.shape.search,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, args) => {
      return db.user.findMany({
        ...query,
        take: args.take ?? undefined,
        skip: args.skip ?? undefined,
        where: args.search
          ? {
              OR: [
                {
                  name: {
                    contains: args.search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: args.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : undefined,
      });
    },
  }),
);

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
