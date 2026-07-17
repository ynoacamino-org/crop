"use client";

import { useNavigate } from "@tanstack/react-router";
import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { AdminArticlesQuery } from "@/service/gql/generated/gql.client";
import { PaginationSection } from "@/shared/components/pagination-controls";
import { SearchInput } from "@/shared/components/search-input";
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
import { DeleteArticleDialog } from "./delete-article-dialog";
import { UpdateArticleStatusDialog } from "./update-article-status-dialog";

type Article = AdminArticlesQuery["articles"]["items"][number];

interface ArticlesListProps {
  articles: Article[];
  totalCount: number;
}

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Borrador",
  ARCHIVED: "Archivado",
};

const STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
};

export function ArticlesList({ articles, totalCount }: ArticlesListProps) {
  const [updatingArticle, setUpdatingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-md flex-1">
          <SearchInput placeholder="Buscar por título..." />
        </div>
        <Button asChild>
          <Link href="/admin/articulos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Crear Artículo
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-50">Título</TableHead>
              <TableHead className="hidden md:table-cell">Autor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden lg:table-cell">Publicado</TableHead>
              <TableHead className="hidden sm:table-cell">Vistas</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron artículos
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-75">
                    <div className="space-y-1">
                      <Link
                        href={`/articulos/${article.slug}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {article.title}
                      </Link>
                      {article.categories.length > 0 && (
                        <p className="line-clamp-1 text-muted-foreground text-xs">
                          {article.categories.map((c) => c.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    {article.author.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[article.status] || "default"}>
                      {STATUS_LABELS[article.status] || article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground text-sm lg:table-cell">
                    {article.publishedAt
                      ? formatMediumDate(article.publishedAt)
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
                    {article.views}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: `/admin/articulos/${article.id}/editar`,
                            })
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setUpdatingArticle(article)}
                        >
                          Cambiar estado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingArticle(article)}
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

      <PaginationSection totalItems={totalCount} />

      {updatingArticle && (
        <UpdateArticleStatusDialog
          article={updatingArticle}
          open={!!updatingArticle}
          onOpenChange={(open) => !open && setUpdatingArticle(null)}
        />
      )}

      {deletingArticle && (
        <DeleteArticleDialog
          article={deletingArticle}
          open={!!deletingArticle}
          onOpenChange={(open) => !open && setDeletingArticle(null)}
        />
      )}
    </div>
  );
}
