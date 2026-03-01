import {
  AlertCircle,
  Calendar,
  Clock,
  Eye,
  Scale,
  Tag,
  User,
} from "lucide-react";
import { notFound } from "next/navigation";
import { RelatedLegalCaseCard } from "@/modules/legal-cases/components/ui/related-legal-case-card";
import {
  ArticleDocument,
  type ArticleQuery,
  type ArticleQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { formatLongDate } from "@/shared/lib/format-date";
import { lexicalToHtml } from "@/shared/lib/lexical-to-html";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const { gql } = await getService();

  const result = await gql.query<ArticleQuery, ArticleQueryVariables>(
    ArticleDocument,
    { slug },
  );

  if (result.error || !result.data?.article) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudo cargar el artículo. Por favor, intenta nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  const article = result.data.article;

  if (!article) {
    notFound();
  }

  const formattedDate = formatLongDate(article.publishedAt);

  // Convertir JSON de Lexical a HTML en el servidor
  const contentHtml = lexicalToHtml(article.content);

  return (
    <article className="space-y-8">
      {/* Header */}
      <header className="space-y-6">
        {/* Categories & Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {article.categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 border-y py-4 text-muted-foreground text-sm">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author.name || "Anónimo"}</span>
          </div>

          {/* Date */}
          {formattedDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}

          {/* Reading Time */}
          {article.readingTimeMin && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readingTimeMin} min de lectura</span>
            </div>
          )}

          {/* Views */}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.views.toLocaleString()} vistas</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-neutral dark:prose-invert mx-auto max-w-none prose-code:rounded prose-img:rounded-lg prose-video:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-headings:font-semibold prose-a:text-primary prose-code:text-sm prose-h2:text-2xl prose-h3:text-xl prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Legal Cases */}
      {article.legalCases && article.legalCases.length > 0 && (
        <>
          <Separator />
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-2xl">
                Casos Legales Relacionados
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {article.legalCases.map((legalCase) => (
                <RelatedLegalCaseCard
                  key={legalCase.id}
                  slug={legalCase.slug}
                  caseName={legalCase.caseName}
                  caseNumber={legalCase.caseNumber}
                  jurisdiction={legalCase.jurisdiction}
                  caseType={legalCase.caseType}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
