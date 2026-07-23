import { Elysia, t } from "elysia";
import {
  getMediaService,
  type UploadMediaResult,
} from "@/application/media/service";
import {
  getMediaTypeFromMime,
  validateMediaType,
} from "@/application/media/validation";
import type { RuntimeEnv } from "@/application/ports/runtime";
import { media } from "@/domain/db/schema";

export function mediaRoutes(rt: RuntimeEnv) {
  return new Elysia().post(
    "/api/media/upload",
    async ({ body, request, status }) => {
      const session = await rt.auth.api.getSession({
        headers: request.headers,
      });
      const user = session?.user;

      if (!user) {
        return status(401, "Unauthorized");
      }

      const file = body.file as File;
      const alt = body.alt as string | undefined;

      if (!file) {
        return status(400, "No se proporcionó ningún archivo");
      }

      const MAX_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return status(413, "El archivo es demasiado grande (máximo 100MB)");
      }

      const mediaType = getMediaTypeFromMime(file.type);

      if (!validateMediaType(file.type, mediaType)) {
        return status(415, `Tipo de archivo no válido para ${mediaType}`);
      }

      const service = getMediaService(rt);
      let uploadResult: UploadMediaResult | undefined;

      try {
        uploadResult = await service.upload({
          file,
          filename: file.name,
          prefix: mediaType.toLowerCase(),
          metadata: {
            uploadedBy: user.id,
            originalName: file.name,
          },
        });

        const db = rt.db.client as unknown as {
          insert: (t: typeof media) => {
            values: (v: typeof media.$inferInsert) => {
              returning: () => Promise<Array<typeof media.$inferSelect>>;
            };
          };
        };

        const [createdMedia] = await db
          .insert(media)
          .values({
            objectKey: uploadResult.objectKey,
            url: uploadResult.url,
            alt,
            type: mediaType,
            size: uploadResult.size,
            mimeType: uploadResult.mimeType,
            filename: uploadResult.filename,
            uploadedBy: user.id,
          })
          .returning();

        if (!createdMedia) {
          return status(
            500,
            "No se pudo registrar el archivo en base de datos",
          );
        }

        return { success: true, data: createdMedia };
      } catch (error) {
        if (uploadResult?.objectKey) {
          try {
            await service.delete(uploadResult.objectKey);
          } catch {}
        }

        const message =
          error instanceof Error ? error.message : "Error al subir el archivo";
        return status(500, message);
      }
    },
    {
      body: t.Object({
        file: t.File(),
        alt: t.Optional(t.String()),
      }),
      type: "multipart/form-data",
    },
  );
}
