import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "#/service/hooks/users";
import type { UsersQuery } from "@/service/gql/generated/gql";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

type User = UsersQuery["users"]["items"][number];

interface DeleteUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const deleteUser = useDeleteUser();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await deleteUser.mutateAsync({ id: user.id });
      toast.success("Usuario eliminado correctamente");
      onOpenChange(false);
      router.invalidate();
    } catch (error: any) {
      toast.error("Error al eliminar usuario", {
        description: error.message || String(error),
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
            Esta acción no se puede deshacer. Esto eliminará permanentemente al
            usuario <strong>{user.name || user.email}</strong> del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
