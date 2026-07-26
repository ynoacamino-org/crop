import {
  CreateMediaPayloadSchema,
  UpdateMediaPayloadSchema,
} from "@repo/schemas/media";
import { builder } from "@/shared/graphql/builder";
import { IntFilter, StringFilter } from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const CreateMediaInput = builder.inputType("CreateMediaInput", {
  fields: (t) => ({
    objectKey: t.string({
      required: true,
      description: "Unique ID in the storage bucket",
    }),
    url: t.string({
      required: true,
      description: "CDN URL of the media",
    }),
    alt: t.string({
      required: false,
      description: "Alternative text for the media",
    }),
    type: t.string({
      required: true,
      description: "Type of media: IMAGE, VIDEO, or AUDIO",
    }),
    size: t.int({
      required: true,
      description: "Size of the file in bytes",
    }),
    mimeType: t.string({
      required: true,
      description: "MIME type of the file",
    }),
    filename: t.string({
      required: true,
      description: "Original filename",
    }),
  }),
  validate: CreateMediaPayloadSchema.shape.input,
});

export const UpdateMediaInput = builder.inputType("UpdateMediaInput", {
  fields: (t) => ({
    alt: t.string({
      required: false,
      description: "Alternative text for the media",
    }),
    url: t.string({
      required: false,
      description: "CDN URL of the media",
    }),
  }),
  validate: UpdateMediaPayloadSchema.shape.input,
});

// --- Filter ---

export const MediaFilter = builder.inputType("MediaFilter", {
  description: "Filter media items by various fields",
  fields: (t) => ({
    objectKey: t.field({
      type: StringFilter,
      description: "Filter by object key",
    }),
    url: t.field({ type: StringFilter, description: "Filter by URL" }),
    alt: t.field({ type: StringFilter, description: "Filter by alt text" }),
    type: t.field({
      type: StringFilter,
      description: "Filter by type (IMAGE, VIDEO, AUDIO, FILE)",
    }),
    mimeType: t.field({
      type: StringFilter,
      description: "Filter by MIME type",
    }),
    filename: t.field({
      type: StringFilter,
      description: "Filter by filename",
    }),
    size: t.field({ type: IntFilter, description: "Filter by size" }),
  }),
});

// --- Sort ---

export const MediaSortField = builder.enumType("MediaSortField", {
  description: "Fields to sort media by",
  values: ["TYPE", "FILENAME", "SIZE", "CREATED_AT"] as const,
});

export const MediaSort = builder.inputType("MediaSort", {
  description: "Sort configuration for media",
  fields: (t) => ({
    field: t.field({
      type: MediaSortField,
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

export const MEDIA_SORT_FIELD_MAP: Record<string, string> = {
  TYPE: "type",
  FILENAME: "filename",
  SIZE: "size",
  CREATED_AT: "createdAt",
};

export const MEDIA_ENUM_FIELDS = new Set(["type"]);
