import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import type { RuntimeEnv } from "@/application/ports/runtime";
import { schema } from "@/infrastructure/graphql/schema";
import { buildContext } from "@/infrastructure/lib/context";

export function createYogaHandler(rt: RuntimeEnv) {
  return createYoga({
    schema,
    plugins: [useCookies()],
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => buildContext(rt, request),
  });
}
