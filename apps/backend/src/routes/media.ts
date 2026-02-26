import { zValidator } from "@hono/zod-validator";
import { UploadMediaPayloadSchema } from "@repo/schemas/media";
import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BadRequestError,
  InternalServerError,
  PayloadTooLargeError,
  UnauthorizedError,
  UnsupportedMediaTypeError,
} from "@/lib/errors/rest";
import { storage } from "@/lib/storage";
import {
  getMediaTypeFromMime,
  type UploadMediaResult,
  uploadMedia,
  validateMediaType,
} from "@/lib/utils/storage";

const mediaRouter = new Hono();

mediaRouter.post(
  "/upload",
  zValidator("form", UploadMediaPayloadSchema),
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
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

    let uploadResult: UploadMediaResult | undefined;

    try {
      uploadResult = await uploadMedia({
        file,
        filename: file.name,
        prefix: validatedData.prefix || mediaType.toLowerCase(),
        metadata: {
          uploadedBy: user.id,
          originalName: file.name,
        },
      });

      const media = await db.media.create({
        data: {
          objectKey: uploadResult.objectKey,
          url: isPublic ? uploadResult.url : null,
          alt: validatedData.alt,
          type: mediaType,
          size: uploadResult.size,
          mimeType: uploadResult.mimeType,
          filename: uploadResult.filename,
          uploadedBy: user.id,
        },
      });

      return c.json(
        {
          success: true,
          data: media,
        },
        201,
      );
    } catch (error) {
      if (uploadResult?.objectKey) {
        try {
          await storage.delete(uploadResult.objectKey);
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

export { mediaRouter };
