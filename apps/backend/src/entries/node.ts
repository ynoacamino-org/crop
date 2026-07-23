import { serve } from "@hono/node-server";
import { runtime } from "@/bootstrap/runtime";
import { app } from "@/entries/edge";

const port = Number.parseInt(runtime.create().env.get("PORT") ?? "7000", 10);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    //biome-ignore lint/suspicious/noConsole: Logging server address for debugging purposes
    console.log(info.address + info.port);
  },
);
