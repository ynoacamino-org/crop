import { describe, expect, it, vi } from "vitest";
import type { DataFetcher } from "@/modules/export/application/service";
import { ExportService } from "@/modules/export/application/service";
import type { ExportJob } from "@/modules/export/domain/job";
import type { ExportJobPort } from "@/modules/export/ports/export-job";
import type { ExportProcessorPort } from "@/modules/export/ports/export-processor";
import type { ObjectPort } from "@/modules/object-storage/ports/storage";

describe("ExportService", () => {
  const mockJobPort: ExportJobPort = {
    createJob: vi.fn(),
    getJob: vi.fn(),
    getUserJobs: vi.fn(),
    updateProgress: vi.fn(),
    setTotalRows: vi.fn(),
    startJob: vi.fn(),
    completeJob: vi.fn(),
    failJob: vi.fn(),
    deleteJob: vi.fn(),
  };

  const mockProcessorPort: ExportProcessorPort = {
    enqueueJob: vi.fn(),
    processNextJob: vi.fn(),
    startWorker: vi.fn(),
    stopWorker: vi.fn(),
    isWorkerRunning: vi.fn(),
  };

  const mockObjectPort: ObjectPort = {
    put: vi.fn().mockResolvedValue("test-key"),
    delete: vi.fn().mockResolvedValue(undefined),
    getSignedUrl: vi.fn().mockResolvedValue("https://example.com/download"),
    getPublicUrl: vi.fn((key: string) => `https://example.com/${key}`),
    generateKey: vi.fn((path: string) => `test-key/${path}`),
  };

  const mockDataFetcher: DataFetcher = {
    count: vi.fn(),
    fetchBatch: vi.fn(),
  };

  const createService = () =>
    new ExportService(
      mockJobPort,
      mockProcessorPort,
      mockObjectPort,
      mockDataFetcher,
    );

  it("should create an export job and enqueue it", async () => {
    const service = createService();
    const mockCreatedJob: ExportJob = {
      id: "job-123",
      userId: "user-1",
      type: "articles-csv",
      status: "pending",
      progress: 0,
      columns: ["title", "status"],
      createdAt: new Date(),
    };

    vi.mocked(mockJobPort.createJob).mockResolvedValue(mockCreatedJob);

    const result = await service.createExport("user-1", {
      userId: "user-1",
      type: "articles-csv",
    });

    expect(result).toEqual({
      jobId: "job-123",
      status: "pending",
      message: 'Exportación "Artículos" iniciada',
    });
    expect(mockJobPort.createJob).toHaveBeenCalledWith({
      userId: "user-1",
      type: "articles-csv",
      filters: undefined,
      columns: ["title", "status", "publishedAt", "views"],
    });
    expect(mockProcessorPort.enqueueJob).toHaveBeenCalledWith(
      "job-123",
      "articles-csv",
    );
  });

  it("should process a job in batches and complete it successfully", async () => {
    const service = createService();
    const mockJob: ExportJob = {
      id: "job-456",
      userId: "user-1",
      type: "courts-csv",
      status: "pending",
      progress: 0,
      columns: ["name", "type"],
      createdAt: new Date(),
    };

    vi.mocked(mockJobPort.getJob).mockResolvedValue(mockJob);
    vi.mocked(mockDataFetcher.count).mockResolvedValue(2);
    vi.mocked(mockDataFetcher.fetchBatch).mockResolvedValue([
      { name: "Corte Suprema", type: "SUPREMA" },
      { name: "Corte Superior", type: "SUPERIOR" },
    ]);

    await service.processJob("job-456");

    expect(mockJobPort.startJob).toHaveBeenCalledWith("job-456");
    expect(mockDataFetcher.count).toHaveBeenCalledWith("courts", undefined);
    expect(mockJobPort.setTotalRows).toHaveBeenCalledWith("job-456", 2);
    expect(mockJobPort.updateProgress).toHaveBeenCalledWith("job-456", 99, 2);
    expect(mockObjectPort.put).toHaveBeenCalledWith(
      "test-key/exports/job-456",
      expect.any(Uint8Array),
      expect.objectContaining({ contentType: "text/csv; charset=utf-8" }),
    );
    expect(mockJobPort.completeJob).toHaveBeenCalledWith(
      "job-456",
      "test-key/exports/job-456",
    );
  });

  it("should handle errors during processing and fail the job", async () => {
    const service = createService();
    const mockJob: ExportJob = {
      id: "job-789",
      userId: "user-1",
      type: "articles-csv",
      status: "pending",
      progress: 0,
      createdAt: new Date(),
    };

    vi.mocked(mockJobPort.getJob).mockResolvedValue(mockJob);
    vi.mocked(mockDataFetcher.count).mockRejectedValue(
      new Error("Database connection lost"),
    );

    await service.processJob("job-789");

    expect(mockJobPort.failJob).toHaveBeenCalledWith(
      "job-789",
      "Database connection lost",
    );
  });

  it("should delete job and associated storage object when deleteJob is called", async () => {
    const service = createService();
    const mockJob: ExportJob = {
      id: "job-del",
      userId: "user-1",
      type: "courts-csv",
      status: "completed",
      progress: 100,
      fileKey: "exports/job-del-key",
      createdAt: new Date(),
    };

    vi.mocked(mockJobPort.getJob).mockResolvedValue(mockJob);

    await service.deleteJob("job-del");

    expect(mockObjectPort.delete).toHaveBeenCalledWith("exports/job-del-key");
    expect(mockJobPort.deleteJob).toHaveBeenCalledWith("job-del");
  });
});
