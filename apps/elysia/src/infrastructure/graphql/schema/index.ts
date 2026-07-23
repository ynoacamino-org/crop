import { builder } from "@/infrastructure/graphql/builder";
import "@/infrastructure/graphql/schema/user";
import "@/infrastructure/graphql/schema/media";
import "@/infrastructure/graphql/schema/court";
import "@/infrastructure/graphql/schema/case-type";
import "@/infrastructure/graphql/schema/pagination";
import "@/infrastructure/graphql/schema/legal-case";
import "@/infrastructure/graphql/schema/article";

export const schema = builder.toSchema();
