import { serve } from "@hono/node-server";
import { runtime } from "@/ports/runtime";
import { app } from "@/server";

const port = Number.parseInt(runtime.create().env.get("PORT") ?? "7000", 10);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (_info) => {},
);
