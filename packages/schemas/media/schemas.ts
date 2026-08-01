import { z } from "zod";

export const UploadMediaPayloadSchema = z.object({
	alt: z
		.string({
			message: "Se espera que el texto alternativo sea una cadena de texto",
		})
		.max(500, {
			message: "El texto alternativo no puede tener más de 500 caracteres",
		})
		.optional(),
	prefix: z
		.string({ message: "Se espera que el prefijo sea una cadena de texto" })
		.max(100, { message: "El prefijo no puede tener más de 100 caracteres" })
		.optional(),
	isPublic: z
		.string()
		.optional()
		.default("true")
		.transform((val) => val === "true"),
});

const MediaTypeEnum = z.enum(["IMAGE", "VIDEO", "AUDIO", "FILE"], {
	message: "El tipo de medio debe ser IMAGE, VIDEO, AUDIO o FILE",
});

const CreateMediaPayloadSchema = z.object({
	input: z.object({
		objectKey: z
			.string({ message: "Se espera que el objectKey sea una cadena de texto" })
			.min(1, { message: "El objectKey es requerido" }),
		url: z.url({ message: "La URL debe ser válida" }).optional(),
		alt: z
			.string({
				message: "Se espera que el texto alternativo sea una cadena de texto",
			})
			.max(500, {
				message: "El texto alternativo no puede tener más de 500 caracteres",
			})
			.optional(),
		type: MediaTypeEnum,
		size: z
			.number({ message: "Se espera que el tamaño sea un número" })
			.int({ message: "El tamaño debe ser un número entero" })
			.positive({ message: "El tamaño debe ser positivo" }),
		mimeType: z
			.string({ message: "Se espera que el mimeType sea una cadena de texto" })
			.min(1, { message: "El mimeType es requerido" }),
		filename: z
			.string({
				message: "Se espera que el nombre de archivo sea una cadena de texto",
			})
			.min(1, { message: "El nombre de archivo es requerido" })
			.max(255, {
				message: "El nombre de archivo no puede tener más de 255 caracteres",
			}),
	}),
});

const UpdateMediaPayloadSchema = z.object({
	id: z
		.string()
		.min(1, { message: "Se espera que el identificador sea un CUID válido" }),
	input: z.object({
		alt: z
			.string({
				message: "Se espera que el texto alternativo sea una cadena de texto",
			})
			.max(500, {
				message: "El texto alternativo no puede tener más de 500 caracteres",
			})
			.optional(),
		url: z.url({ message: "La URL debe ser válida" }).optional(),
	}),
});

const DeleteMediaPayloadSchema = z.object({
	id: z
		.string()
		.min(1, { message: "Se espera que el identificador sea un CUID válido" }),
});

export {
	CreateMediaPayloadSchema,
	DeleteMediaPayloadSchema,
	MediaTypeEnum,
	UpdateMediaPayloadSchema,
};
