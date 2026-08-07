import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminArticlesQuery } from "@/services/gql/generated/gql.client";
import { useDeleteArticleMutation } from "@/services/gql/generated/gql.client";
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
      await deleteArticle({ id: article.id });
      toast.success("Artículo eliminado correctamente");
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      toast.error("Error al eliminar artículo", {
        description: error instanceof Error ? error.message : String(error),
      });
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
