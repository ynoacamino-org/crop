import type { CreateArticleInput } from "@repo/schemas";
import { FileText, Hash, MessageSquare, Text } from "lucide-react";
import type { FieldType } from "@/shared/types/form/field";
import { SUPPORTED_FIELDS } from "@/shared/types/form/supported-fields";

export const articleFormStruct: FieldType<keyof CreateArticleInput>[] = [
  {
    name: "title",
    label: "Título",
    type: SUPPORTED_FIELDS.TEXT,
    icon: FileText,
    placeholder: "Título del artículo",
  },
  {
    name: "slug",
    label: "Slug",
    type: SUPPORTED_FIELDS.TEXT,
    icon: Hash,
    placeholder: "slug-del-articulo",
    description: "URL amigable (se genera automáticamente del título)",
  },
  {
    name: "excerpt",
    label: "Extracto",
    type: SUPPORTED_FIELDS.TEXTAREA,
    icon: MessageSquare,
    placeholder: "Breve resumen del artículo...",
    description: "Máximo 500 caracteres",
  },
  {
    name: "content",
    label: "Contenido",
    type: SUPPORTED_FIELDS.RICH_TEXT,
    icon: Text,
    placeholder: "Escribe el contenido completo aquí...",
    description: "Mínimo 50 caracteres",
  },
  {
    name: "status",
    label: "Estado",
    type: SUPPORTED_FIELDS.SELECT,
    options: [
      { key: "draft", value: "DRAFT", label: "Borrador" },
      { key: "published", value: "PUBLISHED", label: "Publicado" },
      { key: "archived", value: "ARCHIVED", label: "Archivado" },
    ],
  },
];
