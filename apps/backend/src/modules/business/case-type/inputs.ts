import { createCaseTypeSchema, updateCaseTypeSchema } from "@repo/schemas";
import { builder } from "@/shared/graphql/builder";

// Input for creating a case type
export const CreateCaseTypeInput = builder.inputType("CreateCaseTypeInput", {
  fields: (t) => ({
    name: t.string({
      required: true,
      description: "Case type name (e.g., 'Civil', 'Penal')",
    }),
    slug: t.string({
      required: true,
      description: "URL-friendly slug (e.g., 'civil', 'penal')",
    }),
    description: t.string({
      required: false,
      description: "Optional description of the case type",
    }),
    color: t.string({
      required: false,
      description: "Hex color code for UI display (e.g., '#3B82F6')",
    }),
    icon: t.string({
      required: false,
      description: "Icon name for UI display (e.g., 'FileText')",
    }),
    order: t.int({
      required: false,
      description: "Display order (lower numbers appear first)",
    }),
    active: t.boolean({
      required: false,
      description: "Whether this case type is active",
    }),
  }),
});

// Input for updating a case type
export const UpdateCaseTypeInput = builder.inputType("UpdateCaseTypeInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Case type name",
    }),
    slug: t.string({
      required: false,
      description: "URL-friendly slug",
    }),
    description: t.string({
      required: false,
      description: "Description of the case type",
    }),
    color: t.string({
      required: false,
      description: "Hex color code for UI display",
    }),
    icon: t.string({
      required: false,
      description: "Icon name for UI display",
    }),
    order: t.int({
      required: false,
      description: "Display order",
    }),
    active: t.boolean({
      required: false,
      description: "Whether this case type is active",
    }),
  }),
});

// Export validation schemas for runtime validation
export { createCaseTypeSchema, updateCaseTypeSchema };
