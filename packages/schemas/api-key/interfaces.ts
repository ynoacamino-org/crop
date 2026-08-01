import type { z } from "zod";
import type { createApiKeySchema, deleteApiKeySchema } from "./schemas";

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type DeleteApiKeyInput = z.infer<typeof deleteApiKeySchema>;
