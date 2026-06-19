import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { DateTimeResolver } from "graphql-scalars";
import type {
  ArticleModel,
  CaseTypeModel,
  CategoryModel,
  CourtModel,
  LegalCaseModel,
  MediaModel,
  RoleValue,
  TagModel,
  UserModel,
} from "@/db/schema";
import { relations } from "@/db/schema";
import type { D1Db } from "@/ports/db/port";
import type { RuntimeEnv } from "@/ports/runtime/port";

export interface CurrentUser {
  id: string;
  email: string;
  role: RoleValue;
}

export interface AppContextShape {
  user?: CurrentUser;
  db: D1Db;
  runtime: RuntimeEnv;
}

type DrizzleRelations = typeof relations;

export const builder = new SchemaBuilder<{
  Defaults: "v3";
  Objects: {
    User: UserModel;
    Media: MediaModel;
    Article: ArticleModel;
    Category: CategoryModel;
    Tag: TagModel;
    LegalCase: LegalCaseModel;
    Court: CourtModel;
    CaseType: CaseTypeModel;
  };
  AuthScopes: {
    public: boolean;
    authenticated: boolean;
    collaborator: boolean;
    admin: boolean;
  };
  DrizzleRelations: DrizzleRelations;
  Scalars: {
    ID: {
      Output: string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
  Context: AppContextShape;
}>({
  defaults: "v3",
  plugins: [DrizzlePlugin, ValidationPlugin, ScopeAuthPlugin],
  drizzle: {
    client: (ctx: AppContextShape) => ctx.db,
    getTableConfig,
    relations,
  },
  authScopes: (context) => ({
    public: true,
    authenticated: !!context.user,
    collaborator:
      context.user?.role === "COLLABORATOR" || context.user?.role === "ADMIN",
    admin: context.user?.role === "ADMIN",
  }),
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver);
