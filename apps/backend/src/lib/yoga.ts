import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { eq } from "drizzle-orm";
import { createYoga } from "graphql-yoga";
import { users } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { schema } from "@/schema";

export const createYogaHandler = (env: Cloudflare.Env) => {
  const auth = createAuth(env);
  const db = getDb(env);

  return createYoga({
    schema,
    plugins: [useCookies()],
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => {
      const session = await auth.api.getSession({ headers: request.headers });
      let user = session?.user ?? null;

      if (
        user &&
        user.email === "ynoacamino@gmail.com" &&
        user.role !== "ADMIN"
      ) {
        await db
          .update(users)
          .set({ role: "ADMIN" })
          .where(eq(users.id, user.id));
        user = { ...user, role: "ADMIN" };
      }

      return {
        user,
      };
    },
  });
};
