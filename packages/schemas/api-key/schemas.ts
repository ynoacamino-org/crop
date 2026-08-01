import { z } from "zod";

export const createApiKeySchema = z.object({
	name: z
		.string({ message: "El nombre es requerido" })
		.min(1, { message: "El nombre no puede estar vacío" })
		.max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
	expiresIn: z
		.number()
		.int({ message: "La expiración debe ser un número entero" })
		.positive({ message: "La expiración debe ser un número positivo" })
		.max(365, { message: "La expiración no puede ser mayor a 365 días" })
		.optional(),
});

export const deleteApiKeySchema = z.object({
	id: z
		.string({
			message: "Se espera que el identificador sea una cadena de texto",
		})
		.min(1, { message: "El identificador no puede estar vacío" }),
});
