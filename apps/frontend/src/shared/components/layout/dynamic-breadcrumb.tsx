"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { ROUTE_LABELS } from "@/shared/config/constants";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function getSegmentLabel(
  segment: string,
  segments: string[],
  index: number,
): string {
  const isLast = index === segments.length - 1;

  // Si ya está en el diccionario, usar ese label
  if (ROUTE_LABELS[segment]) {
    return ROUTE_LABELS[segment];
  }

  // Si es el último segmento y es una página de detalle
  if (isLast && segments.length > 1) {
    const parentSegment = segments[index - 1];
    if (parentSegment === "articulos") {
      return "Artículo";
    }
    if (parentSegment === "casos") {
      return "Caso Legal";
    }
  }

  // Capitalizar primera letra y reemplazar guiones por espacios
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // No mostrar breadcrumb en la página principal
  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [{ label: "Inicio", href: "/" }];

  // Construir breadcrumbs basados en los segmentos
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Si es el último segmento (página actual), no incluir href
    const isLast = i === segments.length - 1;

    // Obtener label del segmento
    const label = getSegmentLabel(segment, segments, i);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div
            key={`${crumb.href || ""}-${crumb.label}-${index}`}
            className="contents"
          >
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} className="inline-flex items-center">
                    {index === 0 && <Home className="mr-1.5 size-4" />}
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
