import { z } from "zod";

export const EXPORT_STATUS = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;
export type ExportStatus = (typeof EXPORT_STATUS)[number];

export const EXPORT_TYPE_VALUES = [
  "legal-cases-csv",
  "articles-csv",
  "courts-csv",
] as const;
export type ExportType = (typeof EXPORT_TYPE_VALUES)[number];

export interface ExportJob {
  id: string;
  userId: string;
  type: ExportType;
  status: ExportStatus;
  filters?: Record<string, unknown>;
  columns?: string[];
  progress: number;
  totalRows?: number;
  processedRows?: number;
  fileKey?: string;
  downloadUrl?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface CreateExportJobInput {
  userId: string;
  type: ExportType;
  filters?: Record<string, unknown>;
  columns?: string[];
}

export const CreateExportJobSchema = z.object({
  type: z.enum(EXPORT_TYPE_VALUES),
  filters: z.record(z.string(), z.unknown()).optional(),
  columns: z.array(z.string()).optional(),
});

export type CreateExportJobSchemaType = z.infer<typeof CreateExportJobSchema>;
