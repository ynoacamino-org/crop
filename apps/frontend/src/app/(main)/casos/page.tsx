import { Search } from "lucide-react";
import { LegalCaseCard } from "@/modules/legal-cases/components/ui/legal-case-card";
import {
  RecentLegalCasesDocument,
  type RecentLegalCasesQuery,
  type RecentLegalCasesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { PaginatedListWrapper } from "@/shared/components/paginated-list-wrapper";
import { Card, CardContent } from "@/shared/components/ui/card";

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
        <h1 className="flex items-center gap-2 font-bold text-4xl tracking-tight md:text-5xl">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {legalCases.map((legalCase) => (
            <LegalCaseCard
              key={legalCase.id}
              id={legalCase.id}
              slug={legalCase.slug}
              caseNumber={legalCase.caseNumber}
              caseName={legalCase.caseName}
              summary={legalCase.summary}
              jurisdiction={legalCase.jurisdiction}
              caseType={legalCase.caseType}
              caseDate={legalCase.caseDate}
              plaintiff={legalCase.plaintiff}
              defendant={legalCase.defendant}
              court={legalCase.court}
            />
          ))}
        </div>
      </PaginatedListWrapper>
    </div>
  );
}
