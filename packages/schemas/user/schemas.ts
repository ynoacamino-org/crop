import { z } from "zod";

const SignUpPayloadSchema = z.object({
	name: z
		.string({ message: "El nombre es requerido" })
		.min(2, { message: "El nombre debe tener al menos 2 caracteres" })
		.max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
	email: z
		.string({ message: "El email es requerido" })
		.email({ message: "Email inválido" })
		.toLowerCase(),
	password: z
		.string({ message: "La contraseña es requerida" })
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
		.max(128, { message: "La contraseña no puede tener más de 128 caracteres" })
		.regex(/[0-9]/, { message: "La contraseña debe tener al menos un número" }),
});

const SignInPayloadSchema = z.object({
	email: z
		.string({ message: "El email es requerido" })
		.email({ message: "Email inválido" })
		.toLowerCase(),
	password: z
		.string({ message: "La contraseña es requerida" })
		.min(1, { message: "La contraseña es requerida" }),
});

const UpdateMePayloadSchema = z.object({
	input: z.object({
		name: z
			.string({
				message:
					"Se espera que el nombre sea una cadena de texto, no un número",
			})
			.min(2, { message: "El nombre debe tener al menos 2 caracteres" })
			.max(100, { message: "El nombre no puede tener más de 100 caracteres" })
			.optional(),
		image: z.url({ message: "La imagen debe ser una URL válida" }).optional(),
	}),
});

const UpdateUserPayloadSchema = z.object({
	id: z.string({
		message:
			"Se espera que el identificador sea una cadena de texto, no un número",
	}),
	input: z.object({
		name: z
			.string({
				message:
					"Se espera que el nombre sea una cadena de texto, no un número",
			})
			.min(2, { message: "El nombre debe tener al menos 2 caracteres" })
			.max(100, { message: "El nombre no puede tener más de 100 caracteres" })
			.optional(),
		image: z.url({ message: "La imagen debe ser una URL válida" }).optional(),
		role: z
			.enum(["PUBLIC", "COLLABORATOR", "ADMIN"], {
				message: "El rol debe ser PUBLIC, COLLABORATOR o ADMIN",
			})
			.optional(),
	}),
});

const DeleteUserPayloadSchema = z.object({
	id: z
		.string({
			message:
				"Se espera que el identificador sea una cadena de texto, no un número",
		})
		.min(1, { message: "El identificador no puede estar vacío" }),
});

export {
	DeleteUserPayloadSchema,
	SignInPayloadSchema,
	SignUpPayloadSchema,
	UpdateMePayloadSchema,
	UpdateUserPayloadSchema,
};
