import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  Calendar,
  Clock,
  Eye,
  Scale,
  Tag,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RelatedLegalCaseCard } from "@/modules/legal-cases";
import {
  ArticleDocument,
  type ArticleQuery,
} from "@/services/gql/generated/gql.node";
import { createServerService } from "@/services/service.server";
import { formatLongDate } from "@/shared/lib/format-date";
import { lexicalToHtml } from "@/shared/lib/lexical-to-html";

const getArticle = createServerFn()
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { gql } = createServerService();
    const result = await gql.query(ArticleDocument, data).toPromise();
    return result?.data;
  });

export const Route = createFileRoute("/_main/articulos/$slug")({
  loader: async ({ params: { slug } }) => {
    try {
      const data = await getArticle({ data: { slug } });
      if (!data?.article) {
        throw new Error("Artículo no encontrado");
      }
      return { article: data.article };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error al cargar el artículo",
      );
    }
  },
  errorComponent: ({ error }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message ||
          "No se pudo cargar el artículo. Por favor, intenta nuevamente."}
      </AlertDescription>
    </Alert>
  ),
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { article } = Route.useLoaderData();
  const formattedDate = formatLongDate(article.publishedAt);
  const contentHtml = lexicalToHtml(article.content);

  return (
    <article className="space-y-8">
      {/* Header */}
      <header className="space-y-6">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {article.categories.map(
            (
              category: NonNullable<
                ArticleQuery["article"]
              >["categories"][number],
            ) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ),
          )}
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
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
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
            {article.tags.map(
              (tag: NonNullable<ArticleQuery["article"]>["tags"][number]) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ),
            )}
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
              {article.legalCases.map(
                (
                  legalCase: NonNullable<
                    ArticleQuery["article"]
                  >["legalCases"][number],
                ) => (
                  <RelatedLegalCaseCard
                    key={legalCase.id}
                    slug={legalCase.slug}
                    caseName={legalCase.caseName}
                    caseNumber={legalCase.caseNumber}
                    jurisdiction={legalCase.jurisdiction}
                    caseType={legalCase.caseType}
                  />
                ),
              )}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
