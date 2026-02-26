import type { z } from "zod";
import type {
  CreateLegalCasePayloadSchema,
  DeleteLegalCasePayloadSchema,
  LegalCasePayloadSchema,
  LegalCasesPayloadSchema,
  UpdateLegalCasePayloadSchema,
} from "./schemas";

export type LegalCasesPayload = z.infer<typeof LegalCasesPayloadSchema>;
export type LegalCasePayload = z.infer<typeof LegalCasePayloadSchema>;
export type CreateLegalCasePayload = z.infer<typeof CreateLegalCasePayloadSchema>;
export type UpdateLegalCasePayload = z.infer<typeof UpdateLegalCasePayloadSchema>;
export type DeleteLegalCasePayload = z.infer<typeof DeleteLegalCasePayloadSchema>;
