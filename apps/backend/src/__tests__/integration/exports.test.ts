import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import {
  createTestContext,
  seedArticle,
  seedCourt,
  seedUser,
} from "@/__tests__/helpers";
import { exportJobs } from "@/domain/db/schema";
import { createExportService } from "@/modules/export/factory";
import { exportRouter } from "@/modules/export/http/routes";

describe("Export module integration (in-memory)", () => {
  it("creates, processes, and stores a CSV report in-memory", async () => {
    const tc = await createTestContext();
    const user = await seedUser(tc.db, { email: "exporter@example.com" });

    await seedCourt(tc.db, {
      name: "Corte Constitucional",
      type: "CONSTITUCIONAL",
      jurisdiction: "NACIONAL",
    });
    await seedCourt(tc.db, {
      name: "Corte Superior de Lima",
      type: "SUPERIOR",
      jurisdiction: "REGIONAL",
    });

    const service = createExportService(tc.context.runtime);

    const createResult = await service.createExport(user.id, {
      userId: user.id,
      type: "courts-csv",
    });

    expect(createResult.status).toBe("pending");
    expect(createResult.jobId).toBeDefined();

    const [dbJobBefore] = await tc.db
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, createResult.jobId));

    expect(dbJobBefore).toBeDefined();
    expect(dbJobBefore?.status).toBe("pending");
    expect(dbJobBefore?.progress).toBe(0);

    await service.processJob(createResult.jobId);

    const [dbJobAfter] = await tc.db
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, createResult.jobId));

    expect(dbJobAfter?.status).toBe("completed");
    expect(dbJobAfter?.progress).toBe(100);
    expect(dbJobAfter?.totalRows).toBe(2);
    expect(dbJobAfter?.fileKey).toBeDefined();

    // 3. Verify file stored in S3rver object storage via signed download URL
    const job = await service.getJobStatus(createResult.jobId);
    expect(job).not.toBeNull();
    const downloadUrl = await service.getDownloadUrl(job!);
    expect(downloadUrl).toBeDefined();

    const fileRes = await fetch(downloadUrl!);
    expect(fileRes.ok).toBe(true);
    const textContent = await fileRes.text();

    expect(textContent).toContain("Nombre,Tipo,Jurisdicción");
    expect(textContent).toContain("Corte Constitucional");
    expect(textContent).toContain("Corte Superior de Lima");

    await tc.close();
  });

  it("handles empty tables gracefully", async () => {
    const tc = await createTestContext();
    const user = await seedUser(tc.db, { email: "empty@example.com" });
    const service = createExportService(tc.context.runtime);

    const createResult = await service.createExport(user.id, {
      userId: user.id,
      type: "articles-csv",
    });

    await service.processJob(createResult.jobId);

    const [dbJob] = await tc.db
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, createResult.jobId));

    expect(dbJob?.status).toBe("completed");
    expect(dbJob?.totalRows).toBe(0);
    expect(dbJob?.progress).toBe(100);

    await tc.close();
  });

  it("deletes job record and in-memory storage file when deleteJob is called", async () => {
    const tc = await createTestContext();
    const user = await seedUser(tc.db, { email: "deleter@example.com" });
    await seedArticle(tc.db, { title: "Article to Export", authorId: user.id });

    const service = createExportService(tc.context.runtime);
    const createResult = await service.createExport(user.id, {
      userId: user.id,
      type: "articles-csv",
    });

    await service.processJob(createResult.jobId);

    const [jobBefore] = await tc.db
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, createResult.jobId));
    expect(jobBefore?.fileKey).toBeDefined();

    await service.deleteJob(createResult.jobId);

    const [jobAfter] = await tc.db
      .select()
      .from(exportJobs)
      .where(eq(exportJobs.id, createResult.jobId));
    expect(jobAfter).toBeUndefined();

    const deletedUrl = await tc.context.runtime.objects.getSignedUrl(
      jobBefore!.fileKey!,
    );
    const deletedRes = await fetch(deletedUrl);
    expect(deletedRes.status).toBe(404);

    await tc.close();
  });

  it("serves export templates via GET /templates Hono route", async () => {
    const app = exportRouter();
    const res = await app.request("http://localhost/templates");
    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      success: boolean;
      data: Array<{ type: string; name: string }>;
    };
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data.some((t) => t.type === "legal-cases-csv")).toBe(true);
  });
});
