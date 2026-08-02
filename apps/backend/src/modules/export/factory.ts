import { count } from "drizzle-orm";
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
  const tableMap: Record<
    string,
    typeof legalCases | typeof articles | typeof courts
  > = {
    legalCases,
    articles,
    courts,
  };

  return {
    async count(queryKey: string, _filters?: Record<string, unknown>) {
      const dbTable = tableMap[queryKey];
      if (!dbTable) {
        throw new Error(`Tabla no soportada: ${queryKey}`);
      }

      const [result] = await rt.db.client
        .select({ value: count() })
        .from(dbTable as typeof legalCases);

      return result?.value ?? 0;
    },

    async fetchBatch(
      queryKey: string,
      limit: number,
      offset: number,
      _filters?: Record<string, unknown>,
    ) {
      const dbTable = tableMap[queryKey];
      if (!dbTable) {
        throw new Error(`Tabla no soportada: ${queryKey}`);
      }

      const rows = await rt.db.client
        .select()
        .from(dbTable as typeof legalCases)
        .limit(limit)
        .offset(offset);

      return rows as Record<string, unknown>[];
    },
  };
}

export function createExportService(rt: RuntimeEnv): ExportService {
  const adapter = new UpstashStreamsAdapter(rt.config, rt.db);
  const dataFetcher = createDataFetcher(rt);

  return new ExportService(adapter, adapter, rt.objects, dataFetcher);
}
