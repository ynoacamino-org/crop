import { Elysia } from "elysia";
import type { RuntimeEnv } from "@/application/ports/runtime";
import { createYogaHandler } from "@/infrastructure/graphql/yoga";

export function graphqlRoutes(rt: RuntimeEnv) {
  const yoga = createYogaHandler(rt);

  return new Elysia().all("/**", async ({ request }) => {
    return yoga.fetch(request);
  });
}
