import { serve } from "@hono/node-server";
import { app } from "@/entries/edge";
import { runtime } from "@/infrastructure/runtime";

const port = Number.parseInt(runtime.create().env.get("PORT") ?? "7000", 10);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (_info) => {},
);
