import { ArticleCard } from "@/modules/articles/components/ui/article-card";
import {
  RecentArticlesDocument,
  type RecentArticlesQuery,
  type RecentArticlesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { EmptyState } from "@/shared/components/empty-state";
import { PaginationSection } from "@/shared/components/pagination-controls";
import { SearchInput } from "@/shared/components/search-input";
import { parsePaginationParams } from "@/shared/lib/pagination";

interface ArticlesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const { limit, offset } = await parsePaginationParams(searchParams);
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;

  const { gql } = await getService();

  const result = await gql.query<
    RecentArticlesQuery,
    RecentArticlesQueryVariables
  >(RecentArticlesDocument, {
    take: limit,
    skip: offset,
    search,
  });

  const articlesData = result.data?.articles;
  const articles = articlesData?.items || [];
  const pageInfo = articlesData?.pageInfo;
  const totalItems = pageInfo?.totalCount || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-bold text-4xl tracking-tight md:text-5xl">
            Artículos
          </h1>
          <p className="text-muted-foreground">
            Explora nuestro contenido editorial sobre temas legales
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <SearchInput placeholder="Buscar artículos por título..." />
        </div>
      </div>

      {totalItems === 0 ? (
        <EmptyState
          title={
            search
              ? "No se encontraron artículos"
              : "No se encontraron artículos publicados"
          }
          description={
            search ? `No hay resultados para "${search}"` : undefined
          }
        />
      ) : (
        <>
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
          <PaginationSection totalItems={totalItems} />
        </>
      )}
    </div>
  );
}
