import type { ExportType } from "@/modules/export/domain/job";

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

export interface ExportTemplate {
  name: string;
  description?: string;
  type: ExportType;
  columns: ExportColumn[];
  defaultColumns: string[];
  queryKey: string;
}

export const EXPORT_TEMPLATES: Record<ExportType, ExportTemplate> = {
  "legal-cases-csv": {
    name: "Casos Legales",
    description: "Exportar todos los casos legales con sus detalles",
    type: "legal-cases-csv",
    queryKey: "legalCases",
    columns: [
      { key: "caseNumber", label: "Número de Caso" },
      { key: "caseName", label: "Nombre del Caso" },
      { key: "summary", label: "Resumen" },
      { key: "parties", label: "Partes" },
      { key: "plaintiff", label: "Demandante" },
      { key: "defendant", label: "Demandado" },
      { key: "judges", label: "Jueces" },
      { key: "verdict", label: "Veredicto" },
      { key: "jurisdiction", label: "Jurisdicción" },
      { key: "caseDate", label: "Fecha del Caso" },
      { key: "resolutionDate", label: "Fecha de Resolución" },
    ],
    defaultColumns: ["caseNumber", "caseName", "jurisdiction", "caseDate"],
  },
  "articles-csv": {
    name: "Artículos",
    description: "Exportar todos los artículos con su información",
    type: "articles-csv",
    queryKey: "articles",
    columns: [
      { key: "title", label: "Título" },
      { key: "slug", label: "Slug" },
      { key: "excerpt", label: "Extracto" },
      { key: "status", label: "Estado" },
      { key: "publishedAt", label: "Fecha de Publicación" },
      { key: "views", label: "Vistas" },
      { key: "readingTimeMin", label: "Tiempo de Lectura" },
    ],
    defaultColumns: ["title", "status", "publishedAt", "views"],
  },
  "courts-csv": {
    name: "Tribunales",
    description: "Exportar todos los tribunales",
    type: "courts-csv",
    queryKey: "courts",
    columns: [
      { key: "name", label: "Nombre" },
      { key: "type", label: "Tipo" },
      { key: "jurisdiction", label: "Jurisdicción" },
      { key: "description", label: "Descripción" },
    ],
    defaultColumns: ["name", "type", "jurisdiction"],
  },
};

export function getExportTemplate(
  type: ExportType,
): ExportTemplate | undefined {
  return EXPORT_TEMPLATES[type];
}

export function getAllExportTemplates(): ExportTemplate[] {
  return Object.values(EXPORT_TEMPLATES);
}

export function getExportTemplateByQueryKey(
  queryKey: string,
): ExportTemplate | undefined {
  return Object.values(EXPORT_TEMPLATES).find((t) => t.queryKey === queryKey);
}
