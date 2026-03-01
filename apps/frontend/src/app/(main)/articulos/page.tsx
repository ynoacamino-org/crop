import { Search } from "lucide-react";
import { ArticleCard } from "@/modules/articles/components/ui/article-card";
import {
  RecentArticlesDocument,
  type RecentArticlesQuery,
  type RecentArticlesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { PaginatedListWrapper } from "@/shared/components/paginated-list-wrapper";
import { Card, CardContent } from "@/shared/components/ui/card";

const DEFAULT_LIMIT = 12;

interface ArticlesPageProps {
  searchParams: Promise<{ limit?: string; offset?: string }>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;
  const limit = Number(params.limit) || DEFAULT_LIMIT;
  const offset = Number(params.offset) || 0;

  const { gql } = await getService();

  const result = await gql.query<
    RecentArticlesQuery,
    RecentArticlesQueryVariables
  >(RecentArticlesDocument, {
    take: limit,
    skip: offset,
  });

  const articlesData = result.data?.articles;
  const articles = articlesData?.items || [];
  const pageInfo = articlesData?.pageInfo;
  const totalItems = pageInfo?.totalCount || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-bold text-4xl tracking-tight md:text-5xl">
          Artículos
        </h1>
        <p className="text-muted-foreground">
          Explora nuestro contenido editorial sobre temas legales
        </p>
      </div>

      <PaginatedListWrapper
        totalItems={totalItems}
        emptyState={
          <Card>
            <CardContent className="flex min-h-100 flex-col items-center justify-center gap-2 py-8">
              <Search className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                No se encontraron artículos publicados
              </p>
            </CardContent>
          </Card>
        }
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              publishedAt={article.publishedAt}
              readingTimeMin={article.readingTimeMin}
              views={article.views}
              featuredImage={article.featuredImage}
              categories={article.categories}
              author={article.author}
            />
          ))}
        </div>
      </PaginatedListWrapper>
    </div>
  );
}
