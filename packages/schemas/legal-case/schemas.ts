import { z } from "zod";

export const CaseStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
  message: "El estado del caso debe ser DRAFT, PUBLISHED o ARCHIVED",
});

export const CourtLevelEnum = z.enum(["SUPREME", "APPELLATE", "FIRST_INSTANCE", "SPECIALIZED", "CONSTITUTIONAL"], {
  message: "El nivel de corte debe ser SUPREME, APPELLATE, FIRST_INSTANCE, SPECIALIZED o CONSTITUTIONAL",
});

export const LegalAreaEnum = z.enum(
  ["CIVIL", "CRIMINAL", "CONSTITUTIONAL", "ADMINISTRATIVE", "LABOR", "COMMERCIAL", "FAMILY", "TAX", "OTHER"],
  {
    message: "El área legal debe ser un valor válido",
  },
);

export const LegalCasesPayloadSchema = z.object({
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
  legalArea: LegalAreaEnum.optional(),
  courtLevel: CourtLevelEnum.optional(),
  status: CaseStatusEnum.optional(),
  search: z
    .string({ message: "Se espera que el campo búsqueda sea una cadena de texto, no un número" })
    .min(1, { message: "El campo búsqueda debe tener al menos 1 caracteres" })
    .max(100, { message: "El campo búsqueda no puede tener más de 100 caracteres" })
    .optional(),
  authorId: z.cuid({ message: "Se espera que el autor sea un CUID válido" }).optional(),
});

export const LegalCasePayloadSchema = z.object({
  id: z.cuid({ message: "Se espera que el identificador sea un CUID válido" }).optional(),
  caseNumber: z
    .string({ message: "Se espera que el número de caso sea una cadena de texto" })
    .min(1, { message: "El número de caso es requerido" })
    .max(100, { message: "El número de caso no puede tener más de 100 caracteres" })
    .optional(),
});

export const CreateLegalCasePayloadSchema = z.object({
  input: z.object({
    caseNumber: z
      .string({ message: "Se espera que el número de caso sea una cadena de texto" })
      .min(1, { message: "El número de caso es requerido" })
      .max(100, { message: "El número de caso no puede tener más de 100 caracteres" }),
    title: z
      .string({ message: "Se espera que el título sea una cadena de texto" })
      .min(1, { message: "El título es requerido" })
      .max(500, { message: "El título no puede tener más de 500 caracteres" }),
    summary: z
      .string({ message: "Se espera que el resumen sea una cadena de texto" })
      .max(2000, { message: "El resumen no puede tener más de 2000 caracteres" })
      .optional(),
    content: z
      .string({ message: "Se espera que el contenido sea una cadena de texto" })
      .min(1, { message: "El contenido es requerido" }),
    legalArea: LegalAreaEnum,
    court: z
      .string({ message: "Se espera que la corte sea una cadena de texto" })
      .max(200, { message: "La corte no puede tener más de 200 caracteres" })
      .optional(),
    courtLevel: CourtLevelEnum.optional(),
    judge: z
      .string({ message: "Se espera que el juez sea una cadena de texto" })
      .max(200, { message: "El juez no puede tener más de 200 caracteres" })
      .optional(),
    caseDate: z.coerce.date({ message: "La fecha del caso debe ser una fecha válida" }).optional(),
    publicationDate: z.coerce.date({ message: "La fecha de publicación debe ser una fecha válida" }).optional(),
    status: CaseStatusEnum.optional(),
    tags: z
      .array(z.string().max(50, { message: "Cada etiqueta no puede tener más de 50 caracteres" }))
      .max(20, { message: "No se pueden agregar más de 20 etiquetas" })
      .optional(),
    featuredMediaId: z.cuid({ message: "Se espera que el medio destacado sea un CUID válido" }).optional(),
  }),
});

export const UpdateLegalCasePayloadSchema = z.object({
  id: z.cuid({ message: "Se espera que el identificador sea un CUID válido" }),
  input: z.object({
    caseNumber: z
      .string({ message: "Se espera que el número de caso sea una cadena de texto" })
      .min(1, { message: "El número de caso es requerido" })
      .max(100, { message: "El número de caso no puede tener más de 100 caracteres" })
      .optional(),
    title: z
      .string({ message: "Se espera que el título sea una cadena de texto" })
      .min(1, { message: "El título es requerido" })
      .max(500, { message: "El título no puede tener más de 500 caracteres" })
      .optional(),
    summary: z
      .string({ message: "Se espera que el resumen sea una cadena de texto" })
      .max(2000, { message: "El resumen no puede tener más de 2000 caracteres" })
      .optional(),
    content: z
      .string({ message: "Se espera que el contenido sea una cadena de texto" })
      .min(1, { message: "El contenido es requerido" })
      .optional(),
    legalArea: LegalAreaEnum.optional(),
    court: z
      .string({ message: "Se espera que la corte sea una cadena de texto" })
      .max(200, { message: "La corte no puede tener más de 200 caracteres" })
      .optional(),
    courtLevel: CourtLevelEnum.optional(),
    judge: z
      .string({ message: "Se espera que el juez sea una cadena de texto" })
      .max(200, { message: "El juez no puede tener más de 200 caracteres" })
      .optional(),
    caseDate: z.coerce.date({ message: "La fecha del caso debe ser una fecha válida" }).optional(),
    publicationDate: z.coerce.date({ message: "La fecha de publicación debe ser una fecha válida" }).optional(),
    status: CaseStatusEnum.optional(),
    tags: z
      .array(z.string().max(50, { message: "Cada etiqueta no puede tener más de 50 caracteres" }))
      .max(20, { message: "No se pueden agregar más de 20 etiquetas" })
      .optional(),
    featuredMediaId: z.cuid({ message: "Se espera que el medio destacado sea un CUID válido" }).optional(),
  }),
});

export const DeleteLegalCasePayloadSchema = z.object({
  id: z.cuid({ message: "Se espera que el identificador sea un CUID válido" }),
});
