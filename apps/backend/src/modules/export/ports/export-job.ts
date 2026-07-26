import type {
  CreateExportJobInput,
  ExportJob,
} from "@/modules/export/domain/job";

export interface ExportJobPort {
  createJob(input: CreateExportJobInput): Promise<ExportJob>;
  getJob(jobId: string): Promise<ExportJob | null>;
  getUserJobs(userId: string, limit?: number): Promise<ExportJob[]>;
  updateProgress(
    jobId: string,
    progress: number,
    processedRows?: number,
  ): Promise<void>;
  setTotalRows(jobId: string, totalRows: number): Promise<void>;
  startJob(jobId: string): Promise<void>;
  completeJob(jobId: string, fileKey: string): Promise<void>;
  failJob(jobId: string, error: string): Promise<void>;
  deleteJob(jobId: string): Promise<void>;
}
