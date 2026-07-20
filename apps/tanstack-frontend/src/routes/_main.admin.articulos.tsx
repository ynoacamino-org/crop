import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArticlesList } from "#/modules/articles/components/articles-list";
import { createServerService } from "#/service/service.server";

const searchSchema = z.object({
  limit: z.number().optional().catch(12),
  offset: z.number().optional().catch(0),
  search: z.string().optional(),
});

const getAdminArticles = createServerFn()
  .validator(
    (input: { take?: number; skip?: number; search?: string }) => input,
  )
  .handler(async ({ data }) => {
    const { gql } = createServerService();
    return gql.AdminArticles(data);
  });

export const Route = createFileRoute("/_main/admin/articulos")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { limit, offset, search } }) => ({
    limit,
    offset,
    search,
  }),
  loader: async ({ deps: { limit, offset, search } }) => {
    const data = await getAdminArticles({
      data: { take: limit, skip: offset, search },
    });
    return {
      articlesData: data?.articles,
    };
  },
  component: ArticlesAdminPage,
});

function ArticlesAdminPage() {
  const { articlesData } = Route.useLoaderData();
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
