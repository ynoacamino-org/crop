"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  type AdminArticlesQuery,
  useDeleteArticleMutation,
} from "@/service/gql/generated/gql.client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";

type Article = AdminArticlesQuery["articles"]["items"][number];

interface DeleteArticleDialogProps {
  article: Article;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteArticleDialog({
  article,
  open,
  onOpenChange,
}: DeleteArticleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [, deleteArticle] = useDeleteArticleMutation();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteArticle({ id: article.id });

      if (result.error) {
        toast.error("Error al eliminar artículo", {
          description: result.error.message,
        });
        return;
      }

      toast.success("Artículo eliminado correctamente");
      onOpenChange(false);
      router.refresh();
    } catch (_error) {
      toast.error("Error al eliminar artículo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El artículo "{article.title}" será
            eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
