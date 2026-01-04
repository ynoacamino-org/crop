import type z from "zod";
import type {
  CreatePostPayloadSchema,
  DeletePostPayloadSchema,
  PostPayloadSchema,
  PostsPayloadSchema,
  UpdatePostPayloadSchema,
} from "./schemas";

type PostsPayload = z.infer<typeof PostsPayloadSchema>;

type PostPayload = z.infer<typeof PostPayloadSchema>;
type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;

type UpdatePostPayload = z.infer<typeof UpdatePostPayloadSchema>;

type DeletePostPayload = z.infer<typeof DeletePostPayloadSchema>;

export type { PostsPayload, PostPayload, CreatePostPayload, UpdatePostPayload, DeletePostPayload };
