import type { z } from "zod";
import type {
  CreateMediaPayloadSchema,
  DeleteMediaPayloadSchema,
  MediaPayloadSchema,
  MediasPayloadSchema,
  UpdateMediaPayloadSchema,
  UploadMediaPayloadSchema,
} from "./schemas";

export type UploadMediaPayload = z.infer<typeof UploadMediaPayloadSchema>;
export type MediasPayload = z.infer<typeof MediasPayloadSchema>;
export type MediaPayload = z.infer<typeof MediaPayloadSchema>;
export type CreateMediaPayload = z.infer<typeof CreateMediaPayloadSchema>;
export type UpdateMediaPayload = z.infer<typeof UpdateMediaPayloadSchema>;
export type DeleteMediaPayload = z.infer<typeof DeleteMediaPayloadSchema>;
