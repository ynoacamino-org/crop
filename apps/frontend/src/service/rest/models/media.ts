import type { UploadMediaPayload } from "@repo/schemas";

type Media = {
  id: string;
  objectKey: string;
  url: string;
  alt: string | null;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  size: number;
  mimeType: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: string | null;
};

type MediaUploadResponse = {
  success: boolean;
  data: Media;
};

export type { Media, MediaUploadResponse, UploadMediaPayload };
