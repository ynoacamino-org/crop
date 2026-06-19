import { serve } from "@hono/node-server";
import { getAppEnv } from "@/config/env";
import { setDb } from "@/lib/db";
import { RuntimeFactory } from "@/lib/env";
import { app } from "@/server";

const envVars = getAppEnv();
const port = Number.parseInt(envVars.PORT, 10) || 7000;

const rt = RuntimeFactory.create();
setDb(rt.db.client as never);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (_info) => {},
);
