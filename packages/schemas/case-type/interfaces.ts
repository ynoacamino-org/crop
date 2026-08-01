import type { z } from "zod";
import type { createCaseTypeSchema, updateCaseTypeSchema } from "./schemas";

export type CreateCaseTypeInput = z.infer<typeof createCaseTypeSchema>;
export type UpdateCaseTypeInput = z.infer<typeof updateCaseTypeSchema>;
