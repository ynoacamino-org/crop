import { zValidator } from "@hono/zod-validator";
import { UploadMediaPayloadSchema } from "@repo/schemas/media";
import { Hono } from "hono";
import { runtime } from "@/bootstrap/runtime";
import {
  BadRequestError,
  InternalServerError,
  PayloadTooLargeError,
  UnauthorizedError,
  UnsupportedMediaTypeError,
} from "@/core/errors/rest";
import { media } from "@/domain/db/schema";
import {
  getMediaService,
  type UploadMediaResult,
} from "@/modules/media/application/service";
import {
  getMediaTypeFromMime,
  validateMediaType,
} from "@/modules/media/domain/validation";

export function mediaRouter(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>();

  router.post(
    "/upload",
    zValidator("form", UploadMediaPayloadSchema),
    async (c) => {
      const rt = runtime.create({ cf: c.env });

      const session = await rt.auth.api.getSession({
        headers: c.req.raw.headers,
      });
      const user = session?.user;

      if (!user) {
        throw new UnauthorizedError();
      }

      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const validatedData = c.req.valid("form");

      if (!file) {
        throw new BadRequestError("No se proporcionó ningún archivo");
      }

      const MAX_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new PayloadTooLargeError(
          "El archivo es demasiado grande (máximo 100MB)",
        );
      }

      const mediaType = getMediaTypeFromMime(file.type);

      if (!validateMediaType(file.type, mediaType)) {
        throw new UnsupportedMediaTypeError(
          `Tipo de archivo no válido para ${mediaType}`,
        );
      }

      const isPublic = validatedData.isPublic ?? true;
      const service = getMediaService(rt);

      let uploadResult: UploadMediaResult | undefined;

      try {
        uploadResult = await service.upload({
          file,
          filename: file.name,
          prefix: validatedData.prefix || mediaType.toLowerCase(),
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
            url: isPublic ? uploadResult.url : null,
            alt: validatedData.alt,
            type: mediaType,
            size: uploadResult.size,
            mimeType: uploadResult.mimeType,
            filename: uploadResult.filename,
            uploadedBy: user.id,
          })
          .returning();

        if (!createdMedia) {
          throw new InternalServerError(
            "No se pudo registrar el archivo en base de datos",
          );
        }

        return c.json(
          {
            success: true,
            data: createdMedia,
          },
          201,
        );
      } catch (error) {
        if (uploadResult?.objectKey) {
          try {
            await service.delete(uploadResult.objectKey);
          } catch {}
        }

        if (error instanceof Error) {
          throw new InternalServerError(
            `Error al subir el archivo: ${error.message}`,
          );
        } else {
          throw new InternalServerError("Error al subir el archivo");
        }
      }
    },
  );

  return router;
}
