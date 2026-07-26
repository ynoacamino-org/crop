import { serve } from "@hono/node-server";
import { runtime } from "@/bootstrap/runtime";
import { app } from "@/entries/edge";

const rt = runtime.create();

serve(
  {
    fetch: app.fetch,
    port: rt.config.port,
  },
  (info) => {
    //biome-ignore lint/suspicious/noConsole: Logging server address for debugging purposes
    console.log(info.address + info.port);
  },
);
