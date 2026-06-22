/**
 * Genera un slug único a partir del nombre del caso y número de expediente
 */
export function generateCaseSlug(caseName: string, caseNumber: string): string {
  const baseSlug = caseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);

  const caseNumberSlug = caseNumber.toLowerCase().replace(/[^\w\s-]/g, "-");

  return `${baseSlug}-${caseNumberSlug}`.replace(/-+/g, "-");
}
