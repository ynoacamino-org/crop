import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EmptyState } from "#/components/empty-state";
import { PaginationSection } from "#/components/pagination-controls";
import { SearchInput } from "#/components/search-input";
import { sdk } from "#/lib/graphql-client";
import { ArticleCard } from "#/modules/articles/components/ui/article-card";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_main/articulos")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset, search } }) => ({
    limit,
    offset,
    search,
  }),
  loader: async ({ deps: { limit, offset, search } }) => {
    const data = await sdk.RecentArticles({
      take: limit,
      skip: offset,
      search,
    });
    return {
      articlesData: data?.articles,
      search,
    };
  },
  component: ArticlesPage,
});

function ArticlesPage() {
  const { articlesData, search } = Route.useLoaderData();
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
