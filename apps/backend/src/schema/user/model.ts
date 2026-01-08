import { Role } from "@prisma/client/enums";
import { builder } from "@/builder";

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
