import type { CreateArticleInput } from "@repo/schemas";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { ArticleForm } from "#/modules/articles/components/forms/article-form";
import {
  useArticleByIdQuery,
  useUpdateArticleMutation,
} from "#/service/gql/generated/gql.client";

const EditArticlePage = () => {
  const { id: articleId } = Route.useParams();
  const navigate = useNavigate();

  const [{ data, fetching: isLoading, error }] = useArticleByIdQuery({
    variables: { id: articleId },
  });
  const [, updateArticle] = useUpdateArticleMutation();

  if (error) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive">Error al cargar el artículo.</div>
        </div>
      </div>
    );
  }

  if (isLoading || !data?.article) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Cargando artículo...</div>
        </div>
      </div>
    );
  }

  const article = data.article;

  const handleUpdateArticle = async (formData: CreateArticleInput) => {
    try {
      await updateArticle({
        id: articleId,
        input: {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: formData.status,
        },
      });
      toast.success("Artículo actualizado exitosamente");
      navigate({ to: "/admin/articulos" });
    } catch (err) {
      toast.error("Error al actualizar artículo", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleCancel = () => {
    navigate({ to: "/admin/articulos" });
  };

  const initialValues: Partial<CreateArticleInput> = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || "",
    content: article.content,
    status: article.status,
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Edit className="h-6 w-6" />
          <h1 className="font-bold text-3xl">Editar Artículo</h1>
        </div>
        <p className="text-muted-foreground">
          Modifica los campos que desees actualizar
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ArticleForm
          initialValues={initialValues}
          mode="edit"
          onSubmit={handleUpdateArticle}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_main/admin/articulos/$id/editar")({
  component: EditArticlePage,
});
