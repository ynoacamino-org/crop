import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { runtime } from "@/bootstrap/runtime";
import { NotFoundError, UnauthorizedError } from "@/core/errors/rest";
import { CreateExportJobSchema } from "@/modules/export/domain/job";
import { getAllExportTemplates } from "@/modules/export/domain/templates";
import { createExportService } from "@/modules/export/factory";

export function exportRouter(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>();

  router.get("/templates", async (c) => {
    const templates = getAllExportTemplates();
    return c.json({ success: true, data: templates });
  });

  router.post("/", zValidator("json", CreateExportJobSchema), async (c) => {
    const rt = runtime.create({ cf: c.env });

    const session = await rt.auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session?.user) throw new UnauthorizedError();

    const input = c.req.valid("json");
    const service = createExportService(rt);

    const result = await service.createExport(session.user.id, {
      ...input,
      userId: session.user.id,
    });

    return c.json({ success: true, data: result }, 201);
  });

  router.get("/", async (c) => {
    const rt = runtime.create({ cf: c.env });

    const session = await rt.auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session?.user) throw new UnauthorizedError();

    const service = createExportService(rt);
    const jobs = await service.getUserJobs(session.user.id);

    return c.json({ success: true, data: jobs });
  });

  router.get("/:id", async (c) => {
    const rt = runtime.create({ cf: c.env });

    const session = await rt.auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session?.user) throw new UnauthorizedError();

    const jobId = c.req.param("id");
    const service = createExportService(rt);

    const job = await service.getJobStatus(jobId);
    if (!job) throw new NotFoundError("Exportación no encontrada");

    if (job.userId !== session.user.id) {
      throw new UnauthorizedError();
    }

    let downloadUrl = job.downloadUrl ?? undefined;
    if (job.status === "completed" && job.fileKey && !downloadUrl) {
      downloadUrl = (await service.getDownloadUrl(job)) ?? undefined;
    }

    return c.json({
      success: true,
      data: {
        ...job,
        downloadUrl,
      },
    });
  });

  router.delete("/:id", async (c) => {
    const rt = runtime.create({ cf: c.env });

    const session = await rt.auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session?.user) throw new UnauthorizedError();

    const jobId = c.req.param("id");
    const service = createExportService(rt);

    const job = await service.getJobStatus(jobId);
    if (!job) throw new NotFoundError("Exportación no encontrada");

    if (job.userId !== session.user.id) {
      throw new UnauthorizedError();
    }

    return c.json({ success: true, message: "Exportación eliminada" });
  });

  return router;
}
