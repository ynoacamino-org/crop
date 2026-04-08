import { ArticlesList } from "@/modules/articles/components/articles-list";
import {
  AdminArticlesDocument,
  type AdminArticlesQuery,
  type AdminArticlesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { parsePaginationParams } from "@/shared/lib/pagination";

interface ArticlesAdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArticlesAdminPage({
  searchParams,
}: ArticlesAdminPageProps) {
  const { limit, offset } = await parsePaginationParams(searchParams);
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;

  const { gql } = await getService();

  const result = await gql.query<
    AdminArticlesQuery,
    AdminArticlesQueryVariables
  >(AdminArticlesDocument, {
    take: limit,
    skip: offset,
    search,
    status,
  });

  const articlesData = result.data?.articles;
  const articles = articlesData?.items || [];
  const totalCount = articlesData?.pageInfo.totalCount || 0;

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Artículos</h1>
        <p className="text-muted-foreground">
          Gestiona los artículos del sistema
        </p>
      </div>

      <ArticlesList articles={articles} totalCount={totalCount} />
    </div>
  );
}
