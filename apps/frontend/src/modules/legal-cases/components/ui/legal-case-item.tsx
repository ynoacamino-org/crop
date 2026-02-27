"use client";

import { Calendar, Gavel, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";

interface LegalCaseItemProps {
  id: string;
  caseNumber: string;
  caseName: string;
  summary?: string | null;
  jurisdiction?: string | null;
  caseType?: string | null;
  caseDate?: Date | null;
  court?: {
    name: string;
    jurisdiction?: string | null;
  } | null;
}

const caseTypeLabels: Record<string, string> = {
  CIVIL: "Civil",
  PENAL: "Penal",
  CONSTITUCIONAL: "Constitucional",
  LABORAL: "Laboral",
  ADMINISTRATIVO: "Administrativo",
  COMERCIAL: "Comercial",
  FAMILIA: "Familia",
  TRIBUTARIO: "Tributario",
  AMBIENTAL: "Ambiental",
};

const jurisdictionLabels: Record<string, string> = {
  NACIONAL: "Nacional",
  REGIONAL: "Regional",
  LOCAL: "Local",
  INTERNACIONAL: "Internacional",
};

export function LegalCaseItem({
  id,
  caseNumber,
  caseName,
  summary,
  jurisdiction,
  caseType,
  caseDate,
  court,
}: LegalCaseItemProps) {
  const formattedDate = caseDate
    ? caseDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="group border-b py-4 transition-colors hover:bg-muted/30">
      <div className="space-y-2.5 px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/casos/${id}`}
            className="flex-1 space-y-1.5 transition-colors"
          >
            <h3 className="font-semibold text-lg leading-tight tracking-tight group-hover:text-primary">
              {caseName}
            </h3>
            <p className="font-mono text-muted-foreground text-sm">
              {caseNumber}
            </p>
          </Link>

          <div className="flex flex-wrap items-center gap-1.5">
            {caseType && (
              <Badge variant="secondary" className="text-xs">
                {caseTypeLabels[caseType] || caseType}
              </Badge>
            )}
            {jurisdiction && (
              <Badge variant="outline" className="text-xs">
                {jurisdictionLabels[jurisdiction] || jurisdiction}
              </Badge>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
            {summary}
          </p>
        )}

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
          {court && (
            <div className="flex items-center gap-1.5">
              <Gavel className="h-3.5 w-3.5" />
              <span>{court.name}</span>
            </div>
          )}
          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
          {court?.jurisdiction && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {jurisdictionLabels[court.jurisdiction] || court.jurisdiction}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
