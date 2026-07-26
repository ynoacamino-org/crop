import { Link, useLocation } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  if (ROUTE_LABELS[segment]) {
    return ROUTE_LABELS[segment];
  }

  if (isLast && segments.length > 1) {
    const parentSegment = segments[index - 1];
    if (parentSegment === "articulos") {
      return "Artículo";
    }
    if (parentSegment === "casos") {
      return "Caso Legal";
    }
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [{ label: "Inicio", href: "/" }];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    const isLast = i === segments.length - 1;

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
                  <Link to={crumb.href} className="inline-flex items-center">
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
