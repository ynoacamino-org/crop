import { z } from "zod";
import {
  EXPORT_STATUS_VALUES,
  EXPORT_TYPE_VALUES,
  type ExportStatusValue,
  type ExportTypeValue,
} from "@/domain/db/schema";

export const EXPORT_STATUS = EXPORT_STATUS_VALUES;
export type ExportStatus = ExportStatusValue;

export { EXPORT_TYPE_VALUES };
export type ExportType = ExportTypeValue;

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
