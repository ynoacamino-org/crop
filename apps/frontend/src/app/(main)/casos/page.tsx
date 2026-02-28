import { Calendar, FileText, Scale, Search } from "lucide-react";
import Link from "next/link";
import {
  RecentLegalCasesDocument,
  type RecentLegalCasesQuery,
  type RecentLegalCasesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { PaginatedListWrapper } from "@/shared/components/paginated-list-wrapper";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  CASE_TYPE_LABELS,
  JURISDICTION_LABELS,
} from "@/shared/config/constants";
import { formatLongDate } from "@/shared/lib/format-date";

const DEFAULT_LIMIT = 12;

interface LegalCasesPageProps {
  searchParams: Promise<{ limit?: string; offset?: string }>;
}

export default async function LegalCasesPage({
  searchParams,
}: LegalCasesPageProps) {
  const params = await searchParams;
  const limit = Number(params.limit) || DEFAULT_LIMIT;
  const offset = Number(params.offset) || 0;

  const { gql } = await getService();

  const result = await gql.query<
    RecentLegalCasesQuery,
    RecentLegalCasesQueryVariables
  >(RecentLegalCasesDocument, {
    take: limit,
    skip: offset,
  });

  const casesData = result.data?.legalCases;
  const legalCases = casesData?.items || [];
  const pageInfo = casesData?.pageInfo;
  const totalItems = pageInfo?.totalCount || 0;

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

      {/* Search / Filters */}
      {/* TODO: Add search and filter components */}

      <PaginatedListWrapper
        totalItems={totalItems}
        emptyState={
          <Card>
            <CardContent className="flex min-h-100 flex-col items-center justify-center gap-2 py-8">
              <Search className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                No se encontraron casos legales
              </p>
            </CardContent>
          </Card>
        }
      >
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
                        {CASE_TYPE_LABELS[legalCase.caseType] ||
                          legalCase.caseType}
                      </Badge>
                    )}
                    {legalCase.jurisdiction && (
                      <Badge variant="outline">
                        {JURISDICTION_LABELS[legalCase.jurisdiction] ||
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
      </PaginatedListWrapper>
    </div>
  );
}
