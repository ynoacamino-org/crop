import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EmptyState } from "#/components/empty-state";
import { PaginationSection } from "#/components/pagination-controls";
import { sdk } from "#/lib/graphql-client";
import { LegalCaseCard } from "#/modules/legal-cases/components/ui/legal-case-card";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
});

export const Route = createFileRoute("/_main/casos")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset } }) => ({ limit, offset }),
  loader: async ({ deps: { limit, offset } }) => {
    const data = await sdk.RecentLegalCases({
      take: limit,
      skip: offset,
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
