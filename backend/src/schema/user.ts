import z from "zod";
import { Role } from "../../prisma/client/enums";
import { builder } from "../builder";
import { db } from "../db";

builder.enumType(Role, { name: "Role" });

export const User = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    emailVerified: t.expose("emailVerified", {
      type: "DateTime",
      nullable: true,
    }),
    role: t.expose("role", { type: Role }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
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
        validate: z.number().min(1).max(100),
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of users to skip",
        defaultValue: 0,
        validate: z.number().min(0),
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for user name or email",
        validate: z.string().min(3).max(50),
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
    name: t.string({ required: false }),
    image: t.string({ required: false }),
  }),
});

const AdminUpdateUserInput = builder.inputType("AdminUpdateUserInput", {
  fields: (t) => ({
    name: t.string({ required: false }),
    image: t.string({ required: false }),
    role: t.field({ type: Role, required: false }),
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
      id: t.arg.id({ required: true }),
      input: t.arg({ type: AdminUpdateUserInput, required: true }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id, input }) => {
      return db.user.update({
        ...query,
        where: { id: Number(id) },
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
      id: t.arg.id({ required: true }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id }) => {
      return db.user.delete({
        ...query,
        where: { id: Number(id) },
      });
    },
  }),
);
