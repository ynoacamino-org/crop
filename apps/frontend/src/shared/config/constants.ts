/**
 * Constantes centralizadas de la aplicación
 * Este archivo contiene todos los labels, mapeos y configuraciones compartidas
 * para facilitar el mantenimiento y futura internacionalización (i18n)
 */

// ========== RUTAS Y NAVEGACIÓN ==========

export const ROUTE_LABELS: Record<string, string> = {
  articulos: "Artículos",
  casos: "Casos Legales",
  admin: "Administración",
  perfil: "Perfil",
  configuracion: "Configuración",
} as const;

// ========== CASOS LEGALES ==========

export const JURISDICTION_LABELS: Record<string, string> = {
  NACIONAL: "Nacional",
  REGIONAL: "Regional",
  LOCAL: "Local",
  INTERNACIONAL: "Internacional",
} as const;

// ========== ARTÍCULOS ==========

export const ARTICLE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
} as const;

// ========== USUARIOS ==========

export const USER_ROLE_LABELS: Record<string, string> = {
  PUBLIC: "Público",
  COLLABORATOR: "Colaborador",
  ADMIN: "Administrador",
} as const;

// ========== CONFIGURACIÓN GENERAL ==========

export const APP_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
  defaultSortOrder: "desc",
} as const;
