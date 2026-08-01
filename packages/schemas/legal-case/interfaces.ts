import type { z } from "zod";
import type {
	createLegalCaseSchema,
	JurisdictionEnum,
	updateLegalCaseSchema,
} from "./schemas";

export type JurisdictionType = z.infer<typeof JurisdictionEnum>;
export type CreateLegalCaseInput = z.infer<typeof createLegalCaseSchema>;
export type UpdateLegalCaseInput = z.infer<typeof updateLegalCaseSchema>;
