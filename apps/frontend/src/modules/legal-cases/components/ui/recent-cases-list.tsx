"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useRecentLegalCasesQuery } from "@/service/gql/generated/gql.client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { LegalCaseItem } from "./legal-case-item";
import { SearchBar } from "./search-bar";

interface RecentCasesListProps {
  initialTake?: number;
}

export function RecentCasesList({ initialTake = 10 }: RecentCasesListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = initialTake;

  const [result] = useRecentLegalCasesQuery({
    variables: {
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      search: search || undefined,
    },
  });

  const { data, fetching, error } = result;

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1); // Reset to page 1 on new search
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const hasResults = data?.legalCases && data.legalCases.length > 0;
  const hasMore = data?.legalCases && data.legalCases.length === itemsPerPage;
  const hasPrev = page > 1;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} defaultValue={search} />

      {/* Loading State */}
      {fetching && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando casos legales...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !fetching && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar los casos</AlertTitle>
          <AlertDescription>
            No se pudieron cargar los casos legales. Por favor, intenta
            nuevamente más tarde.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!fetching && !error && !hasResults && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay casos disponibles</AlertTitle>
          <AlertDescription>
            {search
              ? `No se encontraron casos que coincidan con "${search}".`
              : "No se encontraron casos legales en este momento."}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {!fetching && hasResults && (
        <>
          <div className="space-y-0">
            <div className="mb-4 flex items-baseline justify-between border-b pb-3">
              <h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                {data.legalCases.length}{" "}
                {data.legalCases.length === 1
                  ? "caso encontrado"
                  : "casos encontrados"}
                {search && (
                  <span className="ml-2 font-normal">para "{search}"</span>
                )}
              </h2>
            </div>

            <div className="divide-y">
              {data.legalCases.map((legalCase) => (
                <LegalCaseItem
                  key={legalCase.id}
                  id={legalCase.id}
                  caseNumber={legalCase.caseNumber}
                  caseName={legalCase.caseName}
                  summary={legalCase.summary}
                  jurisdiction={legalCase.jurisdiction}
                  caseType={legalCase.caseType}
                  caseDate={legalCase.caseDate}
                  court={legalCase.court}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {(hasPrev || hasMore) && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-muted-foreground text-sm">
                Página {page}
                {hasMore && " - Hay más resultados disponibles"}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!hasPrev}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasMore}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
