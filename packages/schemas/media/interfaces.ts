import type { z } from "zod";
import type {
	CreateMediaPayloadSchema,
	DeleteMediaPayloadSchema,
	UpdateMediaPayloadSchema,
	UploadMediaPayloadSchema,
} from "./schemas";

export type UploadMediaPayload = z.infer<typeof UploadMediaPayloadSchema>;
export type UploadMediaPayloadInput = z.input<typeof UploadMediaPayloadSchema>;
export type CreateMediaPayload = z.infer<typeof CreateMediaPayloadSchema>;
export type UpdateMediaPayload = z.infer<typeof UpdateMediaPayloadSchema>;
export type DeleteMediaPayload = z.infer<typeof DeleteMediaPayloadSchema>;
