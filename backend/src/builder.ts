import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import { DateTimeResolver } from "graphql-scalars";
import type { User } from "../prisma/client/client";
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
    user?: User;
  };
}>({
  defaults: "v3",
  plugins: [ValidationPlugin, PrismaPlugin, ScopeAuthPlugin],
  prisma: {
    client: db,
    dmmf: getDatamodel(),
  },
  authScopes: (context) => ({
    public: true,
    admin: context.user?.role === "ADMIN",
    collaborator: !!context.user,
  }),
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver);
