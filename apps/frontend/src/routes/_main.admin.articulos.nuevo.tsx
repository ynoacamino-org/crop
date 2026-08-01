import type { CreateArticleInput } from "@repo/schemas/article";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { ArticleForm } from "@/modules/articles";
import { useCreateArticleMutation } from "@/services/gql/generated/gql.client";
import { getErrorMessage } from "@/shared/lib/get-error-message";

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [, createArticle] = useCreateArticleMutation();

  const handleCreateArticle = async (data: CreateArticleInput) => {
    try {
      await createArticle({
        input: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          status: data.status,
        },
      });
      toast.success("Artículo creado exitosamente");
      navigate({ to: "/admin/articulos" });
    } catch (err) {
      toast.error("Error al crear artículo", {
        description: getErrorMessage(err),
      });
    }
  };

  const handleCancel = () => {
    navigate({ to: "/admin/articulos" });
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="font-bold text-3xl">Crear Nuevo Artículo</h1>
        </div>
        <p className="text-muted-foreground">
          Completa el formulario para crear un nuevo artículo
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ArticleForm onSubmit={handleCreateArticle} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_main/admin/articulos/nuevo")({
  component: NewArticlePage,
});
