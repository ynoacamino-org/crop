import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import { auth } from "./auth";
import { schema } from "./schema";

export const yoga = createYoga({
  schema,
  plugins: [useCookies()],
  graphqlEndpoint: "/api/graphql",
  context: async ({ request }) => {
    console.log("Creating context for request:", request.headers);

    const session = await auth.api.getSession({ headers: request.headers });

    console.log("Session in context:", session);

    return {
      user: session?.user || null,
    };
  },
});
