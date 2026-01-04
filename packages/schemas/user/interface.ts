import type z from "zod";
import type {
  DeleteUserPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
  UserPayloadSchema,
  UsersPayloadSchema,
} from "./schemas";

type UsersPayload = z.infer<typeof UsersPayloadSchema>;

type UserPayload = z.infer<typeof UserPayloadSchema>;

type UpdateMePayload = z.infer<typeof UpdateMePayloadSchema>;

type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;

type DeleteUserPayload = z.infer<typeof DeleteUserPayloadSchema>;

export type { UsersPayload, UserPayload, UpdateMePayload, UpdateUserPayload, DeleteUserPayload };
