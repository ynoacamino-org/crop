export interface ExportProcessorPort {
  enqueueJob(jobId: string, jobType: string): Promise<void>;
  processNextJob(): Promise<{ jobId: string; jobType: string } | null>;
  startWorker(onJob: (jobId: string) => Promise<void>): Promise<void>;
  stopWorker(): Promise<void>;
  isWorkerRunning(): boolean;
}
