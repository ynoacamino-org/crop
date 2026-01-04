import { z } from "zod";

const UsersPayloadSchema = z.object({
  take: z
    .number({ message: "Se espera que el campo límite sea un número, no una cadena de texto" })
    .min(1, { message: "El campo límite debe ser al menos 1" })
    .max(100, { message: "El campo límite no puede ser mayor a 100" })
    .optional(),
  skip: z
    .number({ message: "Se espera que el campo saltar sea un número, no una cadena de texto" })
    .min(0, { message: "El campo saltar debe ser al menos 0" })
    .optional(),
  search: z
    .string({ message: "Se espera que el campo búsqueda sea una cadena de texto, no un número" })
    .min(3, { message: "El campo búsqueda debe tener al menos 3 caracteres" })
    .max(50, { message: "El campo búsqueda no puede tener más de 50 caracteres" })
    .optional(),
});

const UserPayloadSchema = z.object({
  id: z.string({ message: "Se espera que el identificador sea una cadena de texto, no un número" }),
});

const UpdateMePayloadSchema = z.object({
  input: z.object({
    name: z
      .string({ message: "Se espera que el nombre sea una cadena de texto, no un número" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(100, { message: "El nombre no puede tener más de 100 caracteres" })
      .optional(),
    image: z
      .string({ message: "Se espera que la imagen sea una cadena de texto, no un número" })
      .url({ message: "La imagen debe ser una URL válida" })
      .optional(),
  }),
});

const UpdateUserPayloadSchema = z.object({
  id: z.string({ message: "Se espera que el identificador sea una cadena de texto, no un número" }),
  input: z.object({
    name: z
      .string({ message: "Se espera que el nombre sea una cadena de texto, no un número" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(100, { message: "El nombre no puede tener más de 100 caracteres" })
      .optional(),
    image: z
      .string({ message: "Se espera que la imagen sea una cadena de texto, no un número" })
      .url({ message: "La imagen debe ser una URL válida" })
      .optional(),
    role: z.enum(["USER", "ADMIN"], { message: "El rol debe ser USER o ADMIN" }).optional(),
  }),
});

const DeleteUserPayloadSchema = z.object({
  id: z
    .string({ message: "Se espera que el identificador sea una cadena de texto, no un número" })
    .min(1, { message: "El identificador no puede estar vacío" }),
});

export {
  UsersPayloadSchema,
  UserPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
  DeleteUserPayloadSchema,
};
