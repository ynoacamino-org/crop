import {
  AlertCircle,
  Calendar,
  FileText,
  Gavel,
  Scale,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import {
  LegalCaseDocument,
  type LegalCaseQuery,
  type LegalCaseQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import {
  CASE_TYPE_LABELS,
  JURISDICTION_LABELS,
} from "@/shared/config/constants";
import { formatLongDate } from "@/shared/lib/format-date";

interface LegalCasePageProps {
  params: Promise<{ id: string }>;
}

export default async function LegalCasePage({ params }: LegalCasePageProps) {
  const { id } = await params;
  const { gql } = await getService();

  const result = await gql.query<LegalCaseQuery, LegalCaseQueryVariables>(
    LegalCaseDocument,
    { id },
  );

  if (result.error || !result.data?.legalCase) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudo cargar el caso legal. Por favor, intenta nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  const legalCase = result.data.legalCase;

  if (!legalCase) {
    notFound();
  }

  const caseDate = formatLongDate(legalCase.caseDate);
  const resolutionDate = formatLongDate(legalCase.resolutionDate);

  return (
    <article className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <header className="space-y-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {legalCase.caseType && (
            <Badge variant="secondary" className="text-xs">
              <Scale className="mr-1 h-3.5 w-3.5" />
              {CASE_TYPE_LABELS[legalCase.caseType] || legalCase.caseType}
            </Badge>
          )}
          {legalCase.jurisdiction && (
            <Badge variant="outline" className="text-xs">
              {JURISDICTION_LABELS[legalCase.jurisdiction] ||
                legalCase.jurisdiction}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-3xl tracking-tight">
            {legalCase.caseName}
          </h1>
          <p className="font-mono text-muted-foreground text-sm">
            Expediente: {legalCase.caseNumber}
          </p>
        </div>
      </header>

      {/* Metadata Grid */}
      <section className="grid gap-6 border-b pb-6 sm:grid-cols-2">
        {/* Fechas */}
        {(caseDate || resolutionDate) && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
              <Calendar className="h-4 w-4" />
              Fechas
            </h3>
            <dl className="space-y-2 text-sm">
              {caseDate && (
                <>
                  <dt className="font-medium">Fecha del caso</dt>
                  <dd className="text-muted-foreground">{caseDate}</dd>
                </>
              )}
              {resolutionDate && (
                <>
                  <dt className="font-medium">Resolución</dt>
                  <dd className="text-muted-foreground">{resolutionDate}</dd>
                </>
              )}
            </dl>
          </div>
        )}

        {/* Tribunal */}
        {legalCase.court && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
              <Gavel className="h-4 w-4" />
              Tribunal
            </h3>
            <dl className="space-y-2 text-sm">
              <dt className="font-medium">Nombre</dt>
              <dd className="text-muted-foreground">{legalCase.court.name}</dd>
              {legalCase.court.type && (
                <>
                  <dt className="font-medium">Tipo</dt>
                  <dd className="text-muted-foreground">
                    {legalCase.court.type}
                  </dd>
                </>
              )}
              {legalCase.court.jurisdiction && (
                <>
                  <dt className="font-medium">Jurisdicción</dt>
                  <dd className="text-muted-foreground">
                    {JURISDICTION_LABELS[legalCase.court.jurisdiction] ||
                      legalCase.court.jurisdiction}
                  </dd>
                </>
              )}
            </dl>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="space-y-6">
        {/* Resumen */}
        {legalCase.summary && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <FileText className="h-5 w-5" />
              Resumen
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {legalCase.summary}
            </p>
          </div>
        )}

        {/* Partes */}
        {(legalCase.plaintiff || legalCase.defendant || legalCase.parties) && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <Users className="h-5 w-5" />
              Partes Involucradas
            </h2>
            <dl className="space-y-3 text-sm">
              {legalCase.plaintiff && (
                <div>
                  <dt className="font-semibold">Demandante</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {legalCase.plaintiff}
                  </dd>
                </div>
              )}
              {legalCase.defendant && (
                <div>
                  <dt className="font-semibold">Demandado</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {legalCase.defendant}
                  </dd>
                </div>
              )}
              {legalCase.parties &&
                !legalCase.plaintiff &&
                !legalCase.defendant && (
                  <div>
                    <dt className="font-semibold">Partes</dt>
                    <dd className="mt-1 text-muted-foreground">
                      {legalCase.parties}
                    </dd>
                  </div>
                )}
            </dl>
          </div>
        )}

        {/* Jueces */}
        {legalCase.judges && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <Scale className="h-5 w-5" />
              Magistrados
            </h2>
            <p className="text-muted-foreground text-sm">{legalCase.judges}</p>
          </div>
        )}

        {/* Veredicto */}
        {legalCase.verdict && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <Gavel className="h-5 w-5" />
              Decisión
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {legalCase.verdict}
            </p>
          </div>
        )}

        {/* Base Legal */}
        {legalCase.legalBasis && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="flex items-center gap-2 font-semibold text-lg">
              <FileText className="h-5 w-5" />
              Fundamentación Legal
            </h2>
            <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
              {legalCase.legalBasis}
            </p>
          </div>
        )}
      </section>

      {/* Artículos Relacionados */}
      {legalCase.articles && legalCase.articles.length > 0 && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="font-semibold text-lg">Artículos Relacionados</h2>
          <div className="divide-y">
            {legalCase.articles.map((article) => (
              <div
                key={article.id}
                className="py-3 transition-colors hover:bg-muted/30"
              >
                <h3 className="font-medium">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                    {article.excerpt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
