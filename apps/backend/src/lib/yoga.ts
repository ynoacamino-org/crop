import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { eq } from "drizzle-orm";
import { createYoga } from "graphql-yoga";
import { users } from "@/db/schema";
import type { RuntimeEnv } from "@/lib/stores/runtime/types";
import { schema } from "@/schema";

export function YogaHandlerFactory(rt: RuntimeEnv) {
  const db = rt.db.client as unknown as {
    update: (t: typeof users) => {
      set: (v: { role: "ADMIN" }) => {
        where: (w: unknown) => Promise<unknown>;
      };
    };
  };

  return createYoga({
    schema,
    plugins: [useCookies()],
    graphqlEndpoint: "/api/graphql",
    context: async ({ request }) => {
      const session = await rt.auth.api.getSession({
        headers: request.headers,
      });
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

      return { user };
    },
  });
}

export const createYogaHandler = YogaHandlerFactory;
