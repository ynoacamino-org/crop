import type { z } from "zod";
import type {
  CaseTypeEnum,
  createLegalCaseSchema,
  JurisdictionEnum,
  legalCasesQuerySchema,
  updateLegalCaseSchema,
} from "./schemas";

// Type exports for enums
export type JurisdictionType = z.infer<typeof JurisdictionEnum>;
export type CaseTypeType = z.infer<typeof CaseTypeEnum>;

// Query input types
export type LegalCasesQueryInput = z.infer<typeof legalCasesQuerySchema>;

// Mutation input types
export type CreateLegalCaseInput = z.infer<typeof createLegalCaseSchema>;
export type UpdateLegalCaseInput = z.infer<typeof updateLegalCaseSchema>;
