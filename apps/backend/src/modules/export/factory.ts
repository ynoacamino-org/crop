import type { RuntimeEnv } from "@/bootstrap/types";
import { articles, courts, legalCases } from "@/domain/db/schema";
import { UpstashStreamsAdapter } from "@/modules/export/adapters/upstash-streams";
import {
  type DataFetcher,
  ExportService,
} from "@/modules/export/application/service";
import type { ExportJobPort } from "@/modules/export/ports/export-job";
import type { ExportProcessorPort } from "@/modules/export/ports/export-processor";

export function createExportJobAdapter(rt: RuntimeEnv): ExportJobPort {
  return new UpstashStreamsAdapter(rt.config, rt.db);
}

export function createExportProcessorAdapter(
  rt: RuntimeEnv,
): ExportProcessorPort {
  return new UpstashStreamsAdapter(rt.config, rt.db);
}

export function createDataFetcher(rt: RuntimeEnv): DataFetcher {
  return {
    async fetchAll(queryKey: string, _filters?: Record<string, unknown>) {
      const tableMap: Record<string, unknown> = {
        legalCases,
        articles,
        courts,
      };

      const dbTable = tableMap[queryKey];
      if (!dbTable) {
        throw new Error(`Tabla no soportada: ${queryKey}`);
      }

      return rt.db.client
        .select()
        .from(dbTable as typeof legalCases)
        .then((rows) => rows as Record<string, unknown>[]);
    },
  };
}

export function createExportService(rt: RuntimeEnv): ExportService {
  const jobPort = createExportJobAdapter(rt);
  const processorPort = createExportProcessorAdapter(rt);
  const dataFetcher = createDataFetcher(rt);

  return new ExportService(jobPort, processorPort, rt.objects, dataFetcher);
}
