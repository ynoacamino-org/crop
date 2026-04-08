"use client";

import type { CreateArticleInput } from "@repo/schemas";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArticleForm } from "@/modules/articles/components/forms/article-form";
import { useCreateArticleMutation } from "@/service/gql/generated/gql.client";

export default function NewArticlePage() {
  const router = useRouter();
  const [, createArticle] = useCreateArticleMutation();

  const handleCreateArticle = async (data: CreateArticleInput) => {
    const result = await createArticle({
      input: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
      },
    });

    if (result.error) {
      toast.error("Error al crear artículo", {
        description: result.error.message,
      });
      return;
    }

    toast.success("Artículo creado exitosamente");
    router.push("/admin/articulos");
    router.refresh();
  };

  const handleCancel = () => {
    router.back();
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
}
