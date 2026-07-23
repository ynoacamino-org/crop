import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EmptyState } from "#/components/empty-state";
import { PaginationSection } from "#/components/pagination-controls";
import { LegalCaseCard } from "#/modules/legal-cases/components/ui/legal-case-card";
import {
  RecentLegalCasesDocument,
  type RecentLegalCasesQuery,
} from "#/service/gql/generated/gql.node";
import { createServerService } from "#/service/service.server";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
});

const getRecentLegalCases = createServerFn()
  .validator((input: { take?: number; skip?: number }) => input)
  .handler(async ({ data }) => {
    const { gql } = createServerService();
    const result = await gql.query(RecentLegalCasesDocument, data).toPromise();
    return result?.data;
  });

export const Route = createFileRoute("/_main/casos")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset } }) => ({ limit, offset }),
  loader: async ({ deps: { limit, offset } }) => {
    const data = await getRecentLegalCases({
      data: { take: limit, skip: offset },
    });
    return {
      casesData: data?.legalCases,
    };
  },
  component: LegalCasesPage,
});

function LegalCasesPage() {
  const { casesData } = Route.useLoaderData();
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
            {legalCases.map(
              (
                legalCase: RecentLegalCasesQuery["legalCases"]["items"][number],
              ) => (
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
              ),
            )}
          </div>
          <PaginationSection totalItems={totalItems} />
        </>
      )}
    </div>
  );
}
