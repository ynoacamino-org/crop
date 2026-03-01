import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schema } from "@/schema";

export const yoga = createYoga({
  schema,
  plugins: [useCookies()],
  graphqlEndpoint: "/api/graphql",
  context: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    let user = session?.user || null;

    if (
      user &&
      user.email === "ynoacamino@gmail.com" &&
      user.role !== "ADMIN"
    ) {
      await db.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
      user = { ...user, role: "ADMIN" };
    }

    return {
      user,
    };
  },
});
