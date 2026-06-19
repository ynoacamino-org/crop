import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import { buildContext } from "@/lib/context";
import type { RuntimeEnv } from "@/ports/runtime/port";
import { schema } from "@/schema";

export function createYogaHandler(rt: RuntimeEnv) {
  return createYoga({
    schema,
    plugins: [useCookies()],
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => buildContext(rt, request),
  });
}
