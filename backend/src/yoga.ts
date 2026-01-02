import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import { auth } from "./auth";
import { schema } from "./schema";

export const yoga = createYoga({
	schema,
	plugins: [useCookies()],
	graphqlEndpoint: "/api/graphql",
	context: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		return {
			user: session?.user || null,
		};
	},
});
