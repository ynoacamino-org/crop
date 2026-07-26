"use client";

import { Calendar, FileText, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "@/components/ui/link";
import { JURISDICTION_LABELS } from "@/shared/config/constants";
import { formatLongDate } from "@/shared/lib/format-date";

interface LegalCaseCardProps {
  id: string;
  slug: string;
  caseNumber: string;
  caseName: string;
  summary?: string | null;
  jurisdiction?: string | null;
  caseType?: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
    icon?: string | null;
  } | null;
  caseDate?: Date | null;
  plaintiff?: string | null;
  defendant?: string | null;
  court?: {
    name: string;
  } | null;
}

export function LegalCaseCard({
  slug,
  caseNumber,
  caseName,
  summary,
  jurisdiction,
  caseType,
  caseDate,
  plaintiff,
  defendant,
  court,
}: LegalCaseCardProps) {
  return (
    <Link href={`/casos/${slug}`} className="group">
      <Card className="h-full transition-all hover:border-primary hover:shadow-md">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {caseType && <Badge variant="secondary">{caseType.name}</Badge>}
            {jurisdiction && (
              <Badge variant="outline">
                {(JURISDICTION_LABELS as Record<string, string>)[
                  jurisdiction
                ] || jurisdiction}
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary">
            {caseName}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 font-mono text-xs">
            <FileText className="size-3" />
            {caseNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary && (
            <p className="line-clamp-3 text-muted-foreground text-sm">
              {summary}
            </p>
          )}

          <div className="space-y-2 border-t pt-4 text-muted-foreground text-sm">
            {caseDate && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Fecha: {formatLongDate(caseDate)}</span>
              </div>
            )}

            {court && (
              <div className="flex items-center gap-2">
                <Scale className="size-4" />
                <span>{court.name}</span>
              </div>
            )}

            {plaintiff && (
              <div className="text-xs">
                <span className="font-medium">Demandante:</span> {plaintiff}
              </div>
            )}

            {defendant && (
              <div className="text-xs">
                <span className="font-medium">Demandado:</span> {defendant}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
