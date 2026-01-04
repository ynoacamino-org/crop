import { z } from "zod";

const PostsPayloadSchema = z.object({
  take: z
    .number({ message: "Se espera que el campo límite sea un número, no una cadena de texto" })
    .min(1, { message: "El campo límite debe ser al menos 1" })
    .max(100, { message: "El campo límite no puede ser mayor a 100" })
    .optional(),
  skip: z
    .number({ message: "Se espera que el campo saltar sea un número, no una cadena de texto" })
    .min(0, { message: "El campo saltar debe ser al menos 0" })
    .max(100, { message: "El campo saltar no puede ser mayor a 100" })
    .optional(),
  search: z
    .string({ message: "Se espera que el campo búsqueda sea una cadena de texto, no un número" })
    .min(3, { message: "El campo búsqueda debe tener al menos 3 caracteres" })
    .max(100, { message: "El campo búsqueda no puede tener más de 100 caracteres" })
    .optional(),
});

const PostPayloadSchema = z.object({
  id: z.number({ message: "Se espera que el identificador sea un número, no una cadena de texto" }),
});

const CreatePostPayloadSchema = z.object({
  input: z.object({
    title: z
      .string({ message: "Se espera que el título sea una cadena de texto, no un número" })
      .min(3, { message: "El título debe tener al menos 3 caracteres" })
      .max(100, { message: "El título no puede tener más de 100 caracteres" }),
    description: z
      .string({
        message: "Se espera que la descripción sea una cadena de texto, no un número",
      })
      .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
      .max(1000, { message: "La descripción no puede tener más de 1000 caracteres" })
      .optional(),
    image: z.url({ message: "La imagen debe ser una URL válida" }).optional(),
  }),
});

const UpdatePostPayloadSchema = z.object({
  id: z.number({ message: "Se espera que el identificador sea un número, no una cadena de texto" }),
  input: z.object({
    title: z
      .string({ message: "Se espera que el título sea una cadena de texto, no un número" })
      .min(3, { message: "El título debe tener al menos 3 caracteres" })
      .max(100, { message: "El título no puede tener más de 100 caracteres" })
      .optional(),
    description: z
      .string({
        message: "Se espera que la descripción sea una cadena de texto, no un número",
      })
      .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
      .max(1000, { message: "La descripción no puede tener más de 1000 caracteres" })
      .optional(),
    image: z.url({ message: "La imagen debe ser una URL válida" }).optional(),
  }),
});

const DeletePostPayloadSchema = z.object({
  id: z.number({ message: "Se espera que el identificador sea un número, no una cadena de texto" }),
});

export {
  PostsPayloadSchema,
  PostPayloadSchema,
  CreatePostPayloadSchema,
  UpdatePostPayloadSchema,
  DeletePostPayloadSchema,
};
