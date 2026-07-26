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
  fetchAll(
    queryKey: string,
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

  async processJob(jobId: string): Promise<void> {
    const job = await this.jobPort.getJob(jobId);
    if (!job) throw new Error("Job no encontrado");

    const template = EXPORT_TEMPLATES[job.type];
    if (!template) throw new Error("Template no encontrado");

    await this.jobPort.startJob(jobId);

    try {
      const rows = await this.dataFetcher.fetchAll(
        template.queryKey,
        job.filters,
      );

      await this.jobPort.setTotalRows(jobId, rows.length);

      const columns = job.columns ?? template.defaultColumns;
      const columnDefs = template.columns.filter((c) =>
        columns.includes(c.key),
      );

      const csv = this.generateCsv(rows, columns, columnDefs);

      const csvBuffer = new TextEncoder().encode(csv);
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

  private generateCsv(
    rows: Record<string, unknown>[],
    columns: string[],
    columnDefs: { key: string; label: string }[],
  ): string {
    const header = columnDefs
      .map((c) => this.escapeCsvField(c.label))
      .join(",");

    const dataRows = rows.map((row) =>
      columns
        .map((col) => {
          const value = row[col];
          return this.escapeCsvField(this.formatValue(value));
        })
        .join(","),
    );

    return [header, ...dataRows].join("\n");
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
