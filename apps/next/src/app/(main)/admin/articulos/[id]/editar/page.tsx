"use client";

import type { CreateArticleInput } from "@repo/schemas";
import { Edit } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArticleForm } from "@/modules/articles/components/forms/article-form";
import {
  useArticleByIdQuery,
  useUpdateArticleMutation,
} from "@/service/gql/generated/gql.client";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [{ data, fetching, error }] = useArticleByIdQuery({
    variables: { id: articleId },
  });
  const [, updateArticle] = useUpdateArticleMutation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!fetching && data) {
      setIsReady(true);
    }
  }, [fetching, data]);

  if (error) {
    notFound();
  }

  if (fetching || !isReady) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Cargando artículo...</div>
        </div>
      </div>
    );
  }

  if (!data?.article) {
    notFound();
  }

  const article = data.article;

  const handleUpdateArticle = async (formData: CreateArticleInput) => {
    const result = await updateArticle({
      id: articleId,
      input: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status,
      },
    });

    if (result.error) {
      toast.error("Error al actualizar artículo", {
        description: result.error.message,
      });
      return;
    }

    toast.success("Artículo actualizado exitosamente");
    router.push("/admin/articulos");
    router.refresh();
  };

  const handleCancel = () => {
    router.back();
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
}
