import { cors } from "hono/cors";
import { BACKEND_URL } from "./env";

export const corsConfig = cors({
	origin: [BACKEND_URL],
	allowMethods: ["*"],
	allowHeaders: ["Content-Type", "Authorization"],
	exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
	maxAge: 600,
	credentials: true,
});
