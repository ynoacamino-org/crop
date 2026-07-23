import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateArticleStatusMutation } from "#/service/gql/generated/gql.client";
import type {
  AdminArticlesQuery,
  ArticleStatus,
} from "@/service/gql/generated/gql.client";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Article = AdminArticlesQuery["articles"]["items"][number];

interface UpdateArticleStatusDialogProps {
  article: Article;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Publicado" },
  { value: "DRAFT", label: "Borrador" },
  { value: "ARCHIVED", label: "Archivado" },
];

export function UpdateArticleStatusDialog({
  article,
  open,
  onOpenChange,
}: UpdateArticleStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(article.status);
  const router = useRouter();
  const [, updateArticleStatus] = useUpdateArticleStatusMutation();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateArticleStatus({
        id: article.id,
        status: selectedStatus as ArticleStatus,
      });
      toast.success("Estado actualizado correctamente");
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      toast.error("Error al actualizar artículo", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Artículo</DialogTitle>
          <DialogDescription>
            Actualiza el estado de "{article.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
