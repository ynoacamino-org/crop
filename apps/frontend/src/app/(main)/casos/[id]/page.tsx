"use client";

import {
  AlertCircle,
  Calendar,
  FileText,
  Gavel,
  Scale,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useLegalCaseQuery } from "@/service/gql/generated/gql.client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

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

export default function LegalCasePage() {
  const params = useParams();
  const id = params?.id as string;

  const [result] = useLegalCaseQuery({
    variables: { id },
  });

  const { data, fetching, error } = result;

  if (fetching) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data?.legalCase) {
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

  const legalCase = data.legalCase;

  const caseDate = legalCase.caseDate
    ? legalCase.caseDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const resolutionDate = legalCase.resolutionDate
    ? legalCase.resolutionDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {legalCase.caseType && (
            <Badge variant="secondary" className="text-sm">
              <Scale className="mr-1 h-4 w-4" />
              {caseTypeLabels[legalCase.caseType] || legalCase.caseType}
            </Badge>
          )}
          {legalCase.jurisdiction && (
            <Badge variant="outline" className="text-sm">
              {jurisdictionLabels[legalCase.jurisdiction] ||
                legalCase.jurisdiction}
            </Badge>
          )}
        </div>

        <h1 className="font-bold text-4xl tracking-tight">
          {legalCase.caseName}
        </h1>
        <p className="font-mono text-lg text-muted-foreground">
          {legalCase.caseNumber}
        </p>
      </div>

      {/* Main Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseDate && (
              <div>
                <p className="text-muted-foreground text-sm">Fecha del caso</p>
                <p className="font-medium">{caseDate}</p>
              </div>
            )}
            {resolutionDate && (
              <div>
                <p className="text-muted-foreground text-sm">
                  Fecha de resolución
                </p>
                <p className="font-medium">{resolutionDate}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tribunal */}
        {legalCase.court && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gavel className="h-5 w-5" />
                Tribunal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-muted-foreground text-sm">Nombre</p>
                <p className="font-medium">{legalCase.court.name}</p>
              </div>
              {legalCase.court.type && (
                <div>
                  <p className="text-muted-foreground text-sm">Tipo</p>
                  <p className="font-medium">{legalCase.court.type}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumen */}
      {legalCase.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {legalCase.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Partes */}
      {(legalCase.plaintiff || legalCase.defendant || legalCase.parties) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Partes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {legalCase.plaintiff && (
              <div>
                <p className="font-semibold text-sm">Demandante</p>
                <p className="text-muted-foreground">{legalCase.plaintiff}</p>
              </div>
            )}
            {legalCase.defendant && (
              <div>
                <p className="font-semibold text-sm">Demandado</p>
                <p className="text-muted-foreground">{legalCase.defendant}</p>
              </div>
            )}
            {legalCase.parties &&
              !legalCase.plaintiff &&
              !legalCase.defendant && (
                <div>
                  <p className="font-semibold text-sm">Partes involucradas</p>
                  <p className="text-muted-foreground">{legalCase.parties}</p>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Jueces */}
      {legalCase.judges && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Jueces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{legalCase.judges}</p>
          </CardContent>
        </Card>
      )}

      {/* Veredicto */}
      {legalCase.verdict && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Veredicto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {legalCase.verdict}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Base Legal */}
      {legalCase.legalBasis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Base Legal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {legalCase.legalBasis}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Artículos Relacionados */}
      {legalCase.articles && legalCase.articles.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="font-semibold text-2xl">Artículos Relacionados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {legalCase.articles.map((article) => (
                <Card
                  key={article.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.excerpt && (
                      <p className="line-clamp-2 text-muted-foreground text-sm">
                        {article.excerpt}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
