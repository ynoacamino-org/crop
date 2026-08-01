import { createApiKeySchema } from "@repo/schemas/api-key";
import { builder } from "@/shared/graphql/builder";

export const CreateApiKeyInput = builder.inputType("CreateApiKeyInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    expiresIn: t.int({ required: false }),
  }),
  validate: createApiKeySchema,
});
