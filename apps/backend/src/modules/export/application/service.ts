import type {
  CreateExportJobInput,
  ExportJob,
} from "@/modules/export/domain/job";
import { EXPORT_TEMPLATES } from "@/modules/export/domain/templates";
import type { ExportJobPort } from "@/modules/export/ports/export-job";
import type { ExportProcessorPort } from "@/modules/export/ports/export-processor";
import type { ObjectPort } from "@/modules/object-storage/ports/storage";

export interface ExportResult {
  jobId: string;
  status: "pending";
  message: string;
}

export interface DataFetcher {
  count(queryKey: string, filters?: Record<string, unknown>): Promise<number>;
  fetchBatch(
    queryKey: string,
    limit: number,
    offset: number,
    filters?: Record<string, unknown>,
  ): Promise<Record<string, unknown>[]>;
}

export class ExportService {
  constructor(
    private readonly jobPort: ExportJobPort,
    private readonly processorPort: ExportProcessorPort,
    private readonly objects: ObjectPort,
    private readonly dataFetcher: DataFetcher,
  ) {}

  async createExport(
    userId: string,
    input: CreateExportJobInput,
  ): Promise<ExportResult> {
    const template = EXPORT_TEMPLATES[input.type];
    if (!template) {
      throw new Error(`Tipo de export no soportado: ${input.type}`);
    }

    const job = await this.jobPort.createJob({
      userId,
      type: input.type,
      filters: input.filters,
      columns: input.columns ?? template.defaultColumns,
    });

    await this.processorPort.enqueueJob(job.id, job.type);

    return {
      jobId: job.id,
      status: "pending",
      message: `Exportación "${template.name}" iniciada`,
    };
  }

  async getJobStatus(jobId: string): Promise<ExportJob | null> {
    return this.jobPort.getJob(jobId);
  }

  async getUserJobs(userId: string, limit?: number): Promise<ExportJob[]> {
    return this.jobPort.getUserJobs(userId, limit);
  }

  async deleteJob(jobId: string): Promise<void> {
    const job = await this.jobPort.getJob(jobId);
    if (!job) return;

    if (job.fileKey) {
      await this.objects.delete(job.fileKey).catch(() => {});
    }

    await this.jobPort.deleteJob(jobId);
  }

  async processJob(jobId: string): Promise<void> {
    const job = await this.jobPort.getJob(jobId);
    if (!job) throw new Error("Job no encontrado");
    if (job.status === "completed" || job.status === "processing") return;

    const template = EXPORT_TEMPLATES[job.type];
    if (!template) throw new Error("Template no encontrado");

    await this.jobPort.startJob(jobId);

    try {
      const totalRows = await this.dataFetcher.count(
        template.queryKey,
        job.filters,
      );

      await this.jobPort.setTotalRows(jobId, totalRows);

      const columns = job.columns ?? template.defaultColumns;
      const columnDefs = template.columns.filter((c) =>
        columns.includes(c.key),
      );

      const headerLine = columnDefs
        .map((c) => this.escapeCsvField(c.label))
        .join(",");

      const csvLines: string[] = [headerLine];
      const BATCH_SIZE = 500;
      let processedRows = 0;

      if (totalRows > 0) {
        while (processedRows < totalRows) {
          const rows = await this.dataFetcher.fetchBatch(
            template.queryKey,
            BATCH_SIZE,
            processedRows,
            job.filters,
          );

          if (rows.length === 0) break;

          for (const row of rows) {
            const line = columns
              .map((col) => {
                const value = row[col];
                return this.escapeCsvField(this.formatValue(value));
              })
              .join(",");
            csvLines.push(line);
          }

          processedRows += rows.length;
          const progressPercent = Math.min(
            99,
            Math.floor((processedRows / totalRows) * 100),
          );
          await this.jobPort.updateProgress(
            jobId,
            progressPercent,
            processedRows,
          );
        }
      }

      const csvContent = csvLines.join("\n");
      const csvBuffer = new TextEncoder().encode(csvContent);
      const fileKey = this.objects.generateKey(`exports/${jobId}`);

      await this.objects.put(fileKey, csvBuffer, {
        contentType: "text/csv; charset=utf-8",
        metadata: {
          jobId,
          exportedBy: job.userId,
          exportType: job.type,
        },
      });

      await this.jobPort.completeJob(jobId, fileKey);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      await this.jobPort.failJob(jobId, message);
    }
  }

  async getDownloadUrl(job: ExportJob): Promise<string | null> {
    if (job.status !== "completed" || !job.fileKey) return null;

    if (job.downloadUrl) return job.downloadUrl;

    const signedUrl = await this.objects.getSignedUrl(job.fileKey, 3600);
    return signedUrl;
  }

  private escapeCsvField(field: string): string {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }
}
