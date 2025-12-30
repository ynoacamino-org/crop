import { builder } from "../builder";
import { db } from "../db";

export const User = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    role: t.exposeString("role"),
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
    authScopes: {
      admin: true,
    },
    resolve: async (query) => {
      return db.user.findMany({ ...query });
    },
  }),
);
