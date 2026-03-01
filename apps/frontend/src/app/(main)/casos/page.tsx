import { LegalCaseCard } from "@/modules/legal-cases/components/ui/legal-case-card";
import {
  RecentLegalCasesDocument,
  type RecentLegalCasesQuery,
  type RecentLegalCasesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { EmptyState } from "@/shared/components/empty-state";
import { PaginationSection } from "@/shared/components/pagination-controls";
import { parsePaginationParams } from "@/shared/lib/pagination";

interface LegalCasesPageProps {
  searchParams: Promise<{ limit?: string; offset?: string }>;
}

export default async function LegalCasesPage({
  searchParams,
}: LegalCasesPageProps) {
  const { limit, offset } = await parsePaginationParams(searchParams);

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
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-bold text-4xl tracking-tight md:text-5xl">
          Casos Legales
        </h1>
        <p className="text-muted-foreground">
          Explora nuestra colección de casos legales relevantes
        </p>
      </div>

      {totalItems === 0 ? (
        <EmptyState title="No se encontraron casos legales" />
      ) : (
        <>
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
          <PaginationSection totalItems={totalItems} />
        </>
      )}
    </div>
  );
}
