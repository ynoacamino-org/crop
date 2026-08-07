import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  Calendar,
  FileText,
  Gavel,
  Scale,
  Users,
} from "lucide-react";
import {
  LegalCaseDocument,
  type LegalCaseQuery,
} from "@/services/gql/generated/gql.node";
import { createServerService } from "@/services/service.server";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { JURISDICTION_LABELS } from "@/shared/config/constants";
import { formatLongDate } from "@/shared/lib/format-date";

const getLegalCase = createServerFn()
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { gql } = createServerService();
    const result = await gql.query(LegalCaseDocument, data).toPromise();
    return result?.data;
  });

export const Route = createFileRoute("/_main/casos/$slug")({
  loader: async ({ params: { slug } }) => {
    try {
      const data = await getLegalCase({ data: { slug } });
      if (!data?.legalCase) {
        throw new Error("Caso legal no encontrado");
      }
      return { legalCase: data.legalCase };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error al cargar el caso legal",
      );
    }
  },
  errorComponent: ({ error }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message ||
          "No se pudo cargar el caso legal. Por favor, intenta nuevamente."}
      </AlertDescription>
    </Alert>
  ),
  component: LegalCaseDetailPage,
});

function LegalCaseDetailPage() {
  const { legalCase } = Route.useLoaderData();
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
              {legalCase.caseType.name}
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
          <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
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
            <dl className="space-y-2">
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
            <dl className="space-y-2">
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
            <dl className="space-y-3">
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
            <p className="text-muted-foreground">{legalCase.judges}</p>
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
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
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
            {legalCase.articles.map(
              (
                article: NonNullable<
                  LegalCaseQuery["legalCase"]
                >["articles"][number],
              ) => (
                <div
                  key={article.id}
                  className="py-3 transition-colors hover:bg-muted/30"
                >
                  <h3 className="font-medium">{article.title}</h3>
                  {article.excerpt && (
                    <p className="mt-1 line-clamp-2 text-muted-foreground">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </article>
  );
}
