"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteUserDialog } from "@/modules/users/components/delete-user-dialog";
import { EditUserDialog } from "@/modules/users/components/edit-user-dialog";
import { Role, type UsersQuery } from "@/service/gql/generated/gql.client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatMediumDate } from "@/shared/lib/format-date";

type User = UsersQuery["users"]["items"][number];

interface UsersListProps {
  users: User[];
}

const ROLE_LABELS: Record<Role, string> = {
  [Role.Public]: "Público",
  [Role.Collaborator]: "Colaborador",
  [Role.Admin]: "Administrador",
};

const ROLE_COLORS: Record<Role, "default" | "secondary" | "destructive"> = {
  [Role.Public]: "secondary",
  [Role.Collaborator]: "default",
  [Role.Admin]: "default",
};

export function UsersList({ users }: UsersListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.name || "Sin nombre"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_COLORS[user.role] || "default"}>
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatMediumDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingUser(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
        />
      )}
    </>
  );
}
