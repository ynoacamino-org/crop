import { AlertCircle } from "lucide-react";
import {
  type RecentArticlesQuery,
  useRecentArticlesQuery,
} from "#/service/gql/generated/gql.client";
import { ArticleCard } from "@/modules/articles/components/ui/article-card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface RecentArticlesListProps {
  take?: number;
}

export function RecentArticlesList({ take = 8 }: RecentArticlesListProps) {
  const [{ data, fetching: isLoading, error }] = useRecentArticlesQuery({
    variables: { take, skip: 0 },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: take }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
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
          No se pudieron cargar los artículos. Por favor, intenta nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.articles?.items || data.articles.items.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sin artículos</AlertTitle>
        <AlertDescription>
          Aún no hay artículos publicados disponibles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.articles.items.map(
        (article: RecentArticlesQuery["articles"]["items"][number]) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            slug={article.slug}
            excerpt={article.excerpt}
            publishedAt={article.publishedAt}
            readingTimeMin={article.readingTimeMin}
            views={article.views}
            author={article.author}
            featuredImage={article.featuredImage}
            categories={article.categories}
          />
        ),
      )}
    </div>
  );
}
