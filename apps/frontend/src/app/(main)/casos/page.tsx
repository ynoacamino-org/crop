import { Calendar, FileText, Scale, Search } from "lucide-react";
import Link from "next/link";
import {
  RecentLegalCasesDocument,
  type RecentLegalCasesQuery,
  type RecentLegalCasesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatLongDate } from "@/shared/lib/format-date";

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

export default async function LegalCasesPage() {
  const { gql } = await getService();

  const result = await gql.query<
    RecentLegalCasesQuery,
    RecentLegalCasesQueryVariables
  >(RecentLegalCasesDocument, {
    take: 20,
  });

  const legalCases = result.data?.legalCases || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <Scale className="size-8" />
          Casos Legales
        </h1>
        <p className="text-muted-foreground">
          Explora nuestra colección de casos legales relevantes
        </p>
      </div>

      {legalCases.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-100 flex-col items-center justify-center gap-2 py-8">
            <Search className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No se encontraron casos legales
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {legalCases.map((legalCase) => (
            <Link
              key={legalCase.id}
              href={`/casos/${legalCase.id}`}
              className="group"
            >
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {legalCase.caseType && (
                      <Badge variant="secondary">
                        {caseTypeLabels[legalCase.caseType] ||
                          legalCase.caseType}
                      </Badge>
                    )}
                    {legalCase.jurisdiction && (
                      <Badge variant="outline">
                        {jurisdictionLabels[legalCase.jurisdiction] ||
                          legalCase.jurisdiction}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary">
                    {legalCase.caseName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 font-mono text-xs">
                    <FileText className="size-3" />
                    {legalCase.caseNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-muted-foreground text-sm">
                    {legalCase.summary}
                  </p>

                  <div className="space-y-2 border-t pt-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Fecha: {formatLongDate(legalCase.caseDate)}</span>
                    </div>

                    {legalCase.court && (
                      <div className="flex items-center gap-2">
                        <Scale className="size-4" />
                        <span>{legalCase.court.name}</span>
                      </div>
                    )}

                    {legalCase.plaintiff && (
                      <div className="text-xs">
                        <span className="font-medium">Demandante:</span>{" "}
                        {legalCase.plaintiff}
                      </div>
                    )}

                    {legalCase.defendant && (
                      <div className="text-xs">
                        <span className="font-medium">Demandado:</span>{" "}
                        {legalCase.defendant}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
