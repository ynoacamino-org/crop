import type z from "zod";
import type {
	DeleteUserPayloadSchema,
	SignInPayloadSchema,
	SignUpPayloadSchema,
	UpdateMePayloadSchema,
	UpdateUserPayloadSchema,
} from "./schemas";

type SignUpPayload = z.infer<typeof SignUpPayloadSchema>;
type SignInPayload = z.infer<typeof SignInPayloadSchema>;
type UpdateMePayload = z.infer<typeof UpdateMePayloadSchema>;
type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
type DeleteUserPayload = z.infer<typeof DeleteUserPayloadSchema>;

export type {
	DeleteUserPayload,
	SignInPayload,
	SignUpPayload,
	UpdateMePayload,
	UpdateUserPayload,
};
