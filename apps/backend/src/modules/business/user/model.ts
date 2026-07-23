import { ROLE_VALUES } from "@/domain/db/schema";
import { builder } from "@/shared/graphql/builder";

export const Role = builder.enumType("Role", {
  values: ROLE_VALUES,
});

export const User = builder.drizzleObject("users", {
  name: "User",
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
