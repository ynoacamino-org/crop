import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import type { RuntimeEnv } from "@/bootstrap/types";
import { buildContext } from "@/core/context";
import { schema } from "@/shared/graphql/schema";

export function createYogaHandler(rt: RuntimeEnv) {
  return createYoga({
    schema,
    plugins: [useCookies()],
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => buildContext(rt, request),
  });
}
