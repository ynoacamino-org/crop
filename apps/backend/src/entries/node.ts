import { serve } from "@hono/node-server";
import { runtime } from "@/bootstrap/runtime";
import { app } from "@/entries/edge";
import {
  createExportProcessorAdapter,
  createExportService,
} from "@/modules/export/factory";

const rt = runtime.create();

if (rt.config.redis.url && rt.config.redis.token) {
  const processor = createExportProcessorAdapter(rt);
  const service = createExportService(rt);
  processor
    .startWorker(async (jobId) => {
      await service.processJob(jobId);
    })
    .catch((err) => {
      //biome-ignore lint/suspicious/noConsole: Worker startup error log
      console.error("[ExportWorker] Error running stream worker:", err);
    });
}

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
