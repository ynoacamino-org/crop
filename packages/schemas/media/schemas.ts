import { z } from "zod";

export const UploadMediaSchema = z.object({
  alt: z
    .string({ message: "Se espera que el texto alternativo sea una cadena de texto" })
    .max(500, { message: "El texto alternativo no puede tener más de 500 caracteres" })
    .optional(),
  prefix: z
    .string({ message: "Se espera que el prefijo sea una cadena de texto" })
    .max(100, { message: "El prefijo no puede tener más de 100 caracteres" })
    .optional(),
});

const MediaTypeEnum = z.enum(["IMAGE", "VIDEO", "AUDIO"], {
  message: "El tipo de medio debe ser IMAGE, VIDEO o AUDIO",
});

const MediasPayloadSchema = z.object({
  take: z
    .number({ message: "Se espera que el campo límite sea un número, no una cadena de texto" })
    .min(1, { message: "El campo límite debe ser al menos 1" })
    .max(100, { message: "El campo límite no puede ser mayor a 100" })
    .optional(),
  skip: z
    .number({ message: "Se espera que el campo saltar sea un número, no una cadena de texto" })
    .min(0, { message: "El campo saltar debe ser al menos 0" })
    .max(1000, { message: "El campo saltar no puede ser mayor a 1000" })
    .optional(),
  type: MediaTypeEnum.optional(),
  search: z
    .string({ message: "Se espera que el campo búsqueda sea una cadena de texto, no un número" })
    .min(1, { message: "El campo búsqueda debe tener al menos 1 caracteres" })
    .max(100, { message: "El campo búsqueda no puede tener más de 100 caracteres" })
    .optional(),
});

const MediaPayloadSchema = z.object({
  id: z.string().cuid({ message: "Se espera que el identificador sea un CUID válido" }),
});

const CreateMediaPayloadSchema = z.object({
  input: z.object({
    objectKey: z
      .string({ message: "Se espera que el objectKey sea una cadena de texto" })
      .min(1, { message: "El objectKey es requerido" }),
    url: z.url({ message: "La URL debe ser válida" }),
    alt: z
      .string({ message: "Se espera que el texto alternativo sea una cadena de texto" })
      .max(500, { message: "El texto alternativo no puede tener más de 500 caracteres" })
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
      .string({ message: "Se espera que el nombre de archivo sea una cadena de texto" })
      .min(1, { message: "El nombre de archivo es requerido" })
      .max(255, { message: "El nombre de archivo no puede tener más de 255 caracteres" }),
  }),
});

const UpdateMediaPayloadSchema = z.object({
  id: z.string().cuid({ message: "Se espera que el identificador sea un CUID válido" }),
  input: z.object({
    alt: z
      .string({ message: "Se espera que el texto alternativo sea una cadena de texto" })
      .max(500, { message: "El texto alternativo no puede tener más de 500 caracteres" })
      .optional(),
    url: z.url({ message: "La URL debe ser válida" }).optional(),
  }),
});

const DeleteMediaPayloadSchema = z.object({
  id: z.string().cuid({ message: "Se espera que el identificador sea un CUID válido" }),
});

export {
  MediaTypeEnum,
  MediasPayloadSchema,
  MediaPayloadSchema,
  CreateMediaPayloadSchema,
  UpdateMediaPayloadSchema,
  DeleteMediaPayloadSchema,
};
