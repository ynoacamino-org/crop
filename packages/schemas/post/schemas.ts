import { z } from "zod";

const PostsPayloadSchema = z.object({
  take: z.number().min(1).max(100).optional(),
  skip: z.number().min(0).max(100).optional(),
  search: z.string().min(3).max(100).optional(),
});

const PostPayloadSchema = z.object({
  id: z.number(),
});

const CreatePostPayloadSchema = z.object({
  input: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000).optional(),
    image: z.url().optional(),
  }),
});

const UpdatePostPayloadSchema = z.object({
  id: z.number(),
  input: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    image: z.url().optional(),
  }),
});

const DeletePostPayloadSchema = z.object({
  id: z.number(),
});

export type {
  PostsPayloadSchema,
  PostPayloadSchema,
  CreatePostPayloadSchema,
  UpdatePostPayloadSchema,
  DeletePostPayloadSchema,
};
