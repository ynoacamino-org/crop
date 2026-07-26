import {
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas/user";
import { builder } from "@/shared/graphql/builder";
import { StringFilter } from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Display name of the user",
    }),
    image: t.string({
      required: false,
      description: "URL of the user's profile image",
    }),
  }),
  validate: UpdateMePayloadSchema.shape.input,
});

export const AdminUpdateUserInput = builder.inputType("AdminUpdateUserInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Display name of the user",
    }),
    image: t.string({
      required: false,
      description: "URL of the user's profile image",
    }),
    role: t.string({
      required: false,
      description: "User role: PUBLIC, COLLABORATOR, or ADMIN",
    }),
  }),
  validate: UpdateUserPayloadSchema.shape.input,
});

// --- Filter ---

export const UserFilter = builder.inputType("UserFilter", {
  description: "Filter users by various fields",
  fields: (t) => ({
    name: t.field({ type: StringFilter, description: "Filter by name" }),
    email: t.field({ type: StringFilter, description: "Filter by email" }),
    role: t.field({
      type: StringFilter,
      description: "Filter by role (PUBLIC, COLLABORATOR, ADMIN)",
    }),
    bio: t.field({ type: StringFilter, description: "Filter by bio" }),
  }),
});

// --- Sort ---

export const UserSortField = builder.enumType("UserSortField", {
  description: "Fields to sort users by",
  values: ["NAME", "EMAIL", "ROLE", "CREATED_AT"] as const,
});

export const UserSort = builder.inputType("UserSort", {
  description: "Sort configuration for users",
  fields: (t) => ({
    field: t.field({
      type: UserSortField,
      required: true,
      description: "Field to sort by",
    }),
    direction: t.field({
      type: SortDirection,
      required: true,
      description: "Sort direction",
    }),
  }),
});

export const USER_SORT_FIELD_MAP: Record<string, string> = {
  NAME: "name",
  EMAIL: "email",
  ROLE: "role",
  CREATED_AT: "createdAt",
};

export const USER_ENUM_FIELDS = new Set(["role"]);
