import { createYoga } from "graphql-yoga";
import type { RuntimeEnv } from "@/application/ports/runtime";
import { schema } from "@/infrastructure/graphql/schema";
import { buildContext } from "@/infrastructure/lib/context";

export function createYogaHandler(rt: RuntimeEnv) {
  return createYoga({
    schema,
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => buildContext(rt, request),
  });
}
