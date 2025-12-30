import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import { DateTimeResolver } from "graphql-scalars";
import type PrismaTypes from "../prisma/generated";
import { getDatamodel } from "../prisma/generated";

import { db } from "./db";

export const builder = new SchemaBuilder<{
  Defaults: "v3";
  AuthScopes: {
    public: boolean;
    collaborator: boolean;
    admin: boolean;
  };
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: number | string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
  Context: {
    user?: {
      id: number;
      role: "PUBLIC" | "COLLABORATOR" | "ADMIN";
    };
  };
}>({
  defaults: "v3",
  plugins: [ValidationPlugin, PrismaPlugin, ScopeAuthPlugin],
  prisma: {
    client: db,
    dmmf: getDatamodel(),
  },
  authScopes: (context) => ({
    public: !!context.user,
    admin: context.user?.role === "ADMIN",
    collaborator:
      context.user?.role === "COLLABORATOR" || context.user?.role === "ADMIN",
  }),
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver);
