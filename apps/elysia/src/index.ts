import { cors } from "@elysia/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "@/infrastructure/http/routes/auth";
import { devRoutes } from "@/infrastructure/http/routes/dev";
import { graphqlRoutes } from "@/infrastructure/http/routes/graphql";
import { mediaRoutes } from "@/infrastructure/http/routes/media";
import { getRuntime } from "@/infrastructure/runtime";

const rt = getRuntime();
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:7000";
const nodeEnv = process.env.NODE_ENV ?? "development";

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:8000", BACKEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      credentials: true,
    }),
  )
  .use(swagger())
  .use(authRoutes(rt))
  .use(graphqlRoutes(rt))
  .use(mediaRoutes(rt));

if (nodeEnv !== "production") {
  app.use(devRoutes(rt));
}

app.listen(process.env.PORT ?? 7000);

export type App = typeof app;
