import { Redis } from "@upstash/redis";
import { eq } from "drizzle-orm";
import { exportJobs } from "@/domain/db/schema";
import type { EnvConfig } from "@/modules/config/env";
import type { DbPort } from "@/modules/database/ports/db";
import type {
  CreateExportJobInput,
  ExportJob,
} from "@/modules/export/domain/job";
import type { ExportJobPort } from "@/modules/export/ports/export-job";
import type { ExportProcessorPort } from "@/modules/export/ports/export-processor";

const STREAM_KEY = "export:jobs";
const CONSUMER_GROUP = "export-processors";
const DEFAULT_CONSUMER_NAME = `worker-${crypto.randomUUID().slice(0, 8)}`;

export class UpstashStreamsAdapter
  implements ExportJobPort, ExportProcessorPort
{
  private readonly redis: Redis;
  private readonly db: DbPort;
  private isProcessing = false;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private consumerName: string;

  constructor(config: EnvConfig, db: DbPort, consumerName?: string) {
    this.redis = new Redis({
      url: config.redis.url ?? "",
      token: config.redis.token ?? "",
    });
    this.db = db;
    this.consumerName = consumerName ?? DEFAULT_CONSUMER_NAME;
  }

  private get client() {
    return this.db.client;
  }

  // --- ExportJobPort implementation ---

  async createJob(input: CreateExportJobInput): Promise<ExportJob> {
    const jobId = crypto.randomUUID();
    const now = new Date();

    await this.client.insert(exportJobs).values({
      id: jobId,
      userId: input.userId,
      type: input.type,
      status: "pending",
      filters: input.filters ? JSON.stringify(input.filters) : null,
      columns: input.columns ? JSON.stringify(input.columns) : null,
      progress: 0,
      createdAt: now,
    });

    return {
      id: jobId,
      userId: input.userId,
      type: input.type,
      status: "pending",
      filters: input.filters,
      columns: input.columns,
      progress: 0,
      createdAt: now,
    };
  }

  async getJob(jobId: string): Promise<ExportJob | null> {
    const [row] = await this.client
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, jobId))
      .limit(1);

    if (!row) return null;

    return this.mapRowToJob(row);
  }

  async getUserJobs(userId: string, limit = 10): Promise<ExportJob[]> {
    const rows = await this.client
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.userId, userId))
      .limit(limit);

    return rows.map((row) => this.mapRowToJob(row));
  }

  async updateProgress(
    jobId: string,
    progress: number,
    processedRows?: number,
  ): Promise<void> {
    await this.client
      .update(exportJobs)
      .set({
        progress,
        ...(processedRows !== undefined && { processedRows }),
      })
      .where(eq(exportJobs.id, jobId));
  }

  async setTotalRows(jobId: string, totalRows: number): Promise<void> {
    await this.client
      .update(exportJobs)
      .set({ totalRows })
      .where(eq(exportJobs.id, jobId));
  }

  async startJob(jobId: string): Promise<void> {
    await this.client
      .update(exportJobs)
      .set({
        status: "processing",
        startedAt: new Date(),
      })
      .where(eq(exportJobs.id, jobId));
  }

  async completeJob(jobId: string, fileKey: string): Promise<void> {
    await this.client
      .update(exportJobs)
      .set({
        status: "completed",
        fileKey,
        progress: 100,
        completedAt: new Date(),
      })
      .where(eq(exportJobs.id, jobId));
  }

  async failJob(jobId: string, error: string): Promise<void> {
    await this.client
      .update(exportJobs)
      .set({
        status: "failed",
        error,
        completedAt: new Date(),
      })
      .where(eq(exportJobs.id, jobId));
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.client.delete(exportJobs).where(eq(exportJobs.id, jobId));
  }

  // --- ExportProcessorPort implementation ---

  async enqueueJob(jobId: string, jobType: string): Promise<void> {
    await this.redis.xadd(STREAM_KEY, "*", {
      jobId,
      jobType,
      enqueuedAt: Date.now().toString(),
    });
  }

  async processNextJob(): Promise<{ jobId: string; jobType: string } | null> {
    try {
      const result = await this.redis.xreadgroup(
        CONSUMER_GROUP,
        this.consumerName,
        STREAM_KEY,
        ">",
      );

      if (!result || result.length === 0) return null;

      const entries = result[0] as unknown[];
      if (!entries || entries.length === 0) return null;

      const entry = entries[0] as [string, Record<string, string>];
      const [id, fields] = entry;

      if (!id || !fields?.jobId || !fields?.jobType) return null;

      const { jobId, jobType } = fields;

      await this.redis.xackdel(STREAM_KEY, CONSUMER_GROUP, "DELREF", id);

      return { jobId, jobType };
    } catch {
      return null;
    }
  }

  async startWorker(onJob: (jobId: string) => Promise<void>): Promise<void> {
    try {
      await this.redis.xgroup(STREAM_KEY, {
        type: "CREATE",
        group: CONSUMER_GROUP,
        id: "0",
        options: { MKSTREAM: true },
      });
    } catch {
      // Group already exists, ignore
    }

    this.isProcessing = true;

    const poll = async () => {
      if (!this.isProcessing) return;

      try {
        const job = await this.processNextJob();
        if (job) {
          await onJob(job.jobId);
        }
      } catch {
        // Error processing job, will retry on next poll
      }

      if (this.isProcessing) {
        this.pollInterval = setTimeout(poll, 1000);
      }
    };

    await poll();
  }

  async stopWorker(): Promise<void> {
    this.isProcessing = false;
    if (this.pollInterval) {
      clearTimeout(this.pollInterval);
      this.pollInterval = null;
    }
  }

  isWorkerRunning(): boolean {
    return this.isProcessing;
  }

  // --- Private helpers ---

  private mapRowToJob(row: typeof exportJobs.$inferSelect): ExportJob {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type as ExportJob["type"],
      status: row.status as ExportJob["status"],
      filters: row.filters ? JSON.parse(row.filters) : undefined,
      columns: row.columns ? JSON.parse(row.columns) : undefined,
      progress: row.progress,
      totalRows: row.totalRows ?? undefined,
      processedRows: row.processedRows ?? undefined,
      fileKey: row.fileKey ?? undefined,
      downloadUrl: row.downloadUrl ?? undefined,
      error: row.error ?? undefined,
      createdAt: row.createdAt,
      startedAt: row.startedAt ?? undefined,
      completedAt: row.completedAt ?? undefined,
    };
  }
}
