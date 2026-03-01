import type { z } from "zod";
import type { caseTypesQuerySchema, createCaseTypeSchema, updateCaseTypeSchema } from "./schemas";

export type CreateCaseTypeInput = z.infer<typeof createCaseTypeSchema>;
export type UpdateCaseTypeInput = z.infer<typeof updateCaseTypeSchema>;
export type CaseTypesQueryInput = z.infer<typeof caseTypesQuerySchema>;

export type { createCaseTypeSchema, updateCaseTypeSchema, caseTypesQuerySchema };
