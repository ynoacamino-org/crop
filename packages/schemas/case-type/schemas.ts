import { z } from "zod";

// Schema for creating a case type
export const createCaseTypeSchema = z.object({
	name: z
		.string({ message: "El nombre es requerido" })
		.min(3, { message: "El nombre debe tener al menos 3 caracteres" })
		.max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
	slug: z
		.string({ message: "El slug es requerido" })
		.min(2, { message: "El slug debe tener al menos 2 caracteres" })
		.max(100, { message: "El slug no puede tener más de 100 caracteres" })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"El slug solo puede contener letras minúsculas, números y guiones",
		}),
	description: z
		.string()
		.max(500, {
			message: "La descripción no puede tener más de 500 caracteres",
		})
		.optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, {
			message: "El color debe ser un código hexadecimal válido (ej: #3B82F6)",
		})
		.optional(),
	icon: z
		.string()
		.min(1, { message: "El ícono debe tener al menos 1 carácter" })
		.max(50, { message: "El ícono no puede tener más de 50 caracteres" })
		.optional(),
	order: z
		.number()
		.int()
		.min(0, { message: "El orden debe ser un número entero no negativo" })
		.optional(),
	active: z.boolean().optional(),
});

// Schema for updating a case type
export const updateCaseTypeSchema = z.object({
	name: z
		.string()
		.min(3, { message: "El nombre debe tener al menos 3 caracteres" })
		.max(100, { message: "El nombre no puede tener más de 100 caracteres" })
		.optional(),
	slug: z
		.string()
		.min(2, { message: "El slug debe tener al menos 2 caracteres" })
		.max(100, { message: "El slug no puede tener más de 100 caracteres" })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"El slug solo puede contener letras minúsculas, números y guiones",
		})
		.optional(),
	description: z
		.string()
		.max(500, {
			message: "La descripción no puede tener más de 500 caracteres",
		})
		.optional()
		.nullable(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, {
			message: "El color debe ser un código hexadecimal válido (ej: #3B82F6)",
		})
		.optional()
		.nullable(),
	icon: z
		.string()
		.min(1, { message: "El ícono debe tener al menos 1 carácter" })
		.max(50, { message: "El ícono no puede tener más de 50 caracteres" })
		.optional()
		.nullable(),
	order: z
		.number()
		.int()
		.min(0, { message: "El orden debe ser un número entero no negativo" })
		.optional(),
	active: z.boolean().optional(),
});

// Schema for querying case types
export const caseTypesQuerySchema = z.object({
	active: z.boolean().optional(),
	search: z.string().optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
});
