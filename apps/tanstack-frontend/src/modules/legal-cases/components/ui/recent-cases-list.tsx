import { AlertCircle } from "lucide-react";
import { useRecentLegalCases } from "#/service/hooks/legal-cases";
import { LegalCaseItem } from "@/modules/legal-cases/components/ui/legal-case-item";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface RecentCasesListProps {
  take?: number;
}

export function RecentCasesList({ take = 8 }: RecentCasesListProps) {
  const { data, isLoading, error } = useRecentLegalCases({ take, skip: 0 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: take }).map((_, i) => (
          <div key={i} className="space-y-3 border-b pb-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los casos legales. Por favor, intenta
          nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.legalCases?.items || data.legalCases.items.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sin casos</AlertTitle>
        <AlertDescription>
          Aún no hay casos legales disponibles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="divide-y">
      {data.legalCases.items.map((legalCase) => (
        <LegalCaseItem
          key={legalCase.id}
          id={legalCase.id}
          slug={legalCase.slug}
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
  );
}
