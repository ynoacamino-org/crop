import { z } from "zod";

// Enums from Prisma schema
export const JurisdictionEnum = z.enum(["NACIONAL", "REGIONAL", "LOCAL", "INTERNACIONAL"], {
  message: "La jurisdicción debe ser NACIONAL, REGIONAL, LOCAL o INTERNACIONAL",
});

// Keep legacy enums for backward compatibility
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

// Schema for creating a legal case
export const createLegalCaseSchema = z.object({
  caseNumber: z
    .string({ message: "El número de caso es requerido" })
    .min(1, { message: "El número de caso es requerido" })
    .max(100, { message: "El número de caso no puede tener más de 100 caracteres" }),
  caseName: z
    .string({ message: "El nombre del caso es requerido" })
    .min(1, { message: "El nombre del caso es requerido" })
    .max(500, { message: "El nombre del caso no puede tener más de 500 caracteres" }),
  summary: z.string().max(2000, { message: "El resumen no puede tener más de 2000 caracteres" }).optional(),
  parties: z.string().max(1000, { message: "Las partes no pueden tener más de 1000 caracteres" }).optional(),
  plaintiff: z.string().max(300, { message: "El demandante no puede tener más de 300 caracteres" }).optional(),
  defendant: z.string().max(300, { message: "El demandado no puede tener más de 300 caracteres" }).optional(),
  judges: z.string().max(500, { message: "Los jueces no pueden tener más de 500 caracteres" }).optional(),
  verdict: z.string().max(5000, { message: "El veredicto no puede tener más de 5000 caracteres" }).optional(),
  legalBasis: z.string().max(5000, { message: "La base legal no puede tener más de 5000 caracteres" }).optional(),
  jurisdiction: JurisdictionEnum.optional(),
  caseTypeId: z.string().cuid({ message: "El ID del tipo de caso debe ser un CUID válido" }).optional(),
  courtId: z.string().cuid({ message: "El ID del tribunal debe ser un CUID válido" }).optional(),
});

// Schema for updating a legal case
export const updateLegalCaseSchema = z.object({
  caseNumber: z
    .string()
    .min(1, { message: "El número de caso es requerido" })
    .max(100, { message: "El número de caso no puede tener más de 100 caracteres" })
    .optional(),
  caseName: z
    .string()
    .min(1, { message: "El nombre del caso es requerido" })
    .max(500, { message: "El nombre del caso no puede tener más de 500 caracteres" })
    .optional(),
  summary: z.string().max(2000, { message: "El resumen no puede tener más de 2000 caracteres" }).optional().nullable(),
  parties: z.string().max(1000, { message: "Las partes no pueden tener más de 1000 caracteres" }).optional().nullable(),
  plaintiff: z
    .string()
    .max(300, { message: "El demandante no puede tener más de 300 caracteres" })
    .optional()
    .nullable(),
  defendant: z
    .string()
    .max(300, { message: "El demandado no puede tener más de 300 caracteres" })
    .optional()
    .nullable(),
  judges: z.string().max(500, { message: "Los jueces no pueden tener más de 500 caracteres" }).optional().nullable(),
  verdict: z
    .string()
    .max(5000, { message: "El veredicto no puede tener más de 5000 caracteres" })
    .optional()
    .nullable(),
  legalBasis: z
    .string()
    .max(5000, { message: "La base legal no puede tener más de 5000 caracteres" })
    .optional()
    .nullable(),
  jurisdiction: JurisdictionEnum.optional().nullable(),
  caseTypeId: z.string().cuid({ message: "El ID del tipo de caso debe ser un CUID válido" }).optional().nullable(),
  courtId: z.string().cuid({ message: "El ID del tribunal debe ser un CUID válido" }).optional().nullable(),
});

// Query schema for fetching legal cases
export const legalCasesQuerySchema = z.object({
  jurisdiction: JurisdictionEnum.optional(),
  caseTypeId: z.string().cuid().optional(),
  courtId: z.string().cuid().optional(),
  search: z
    .string()
    .min(1, { message: "El campo búsqueda debe tener al menos 1 carácter" })
    .max(100, { message: "El campo búsqueda no puede tener más de 100 caracteres" })
    .optional(),
  take: z.number().min(1).max(100).optional(),
  skip: z.number().min(0).optional(),
});
