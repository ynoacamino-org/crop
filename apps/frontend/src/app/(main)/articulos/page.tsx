import { BookOpen, Calendar, Clock, Eye, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  RecentArticlesDocument,
  type RecentArticlesQuery,
  type RecentArticlesQueryVariables,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatLongDate } from "@/shared/lib/format-date";

export default async function ArticlesPage() {
  const { gql } = await getService();

  const result = await gql.query<
    RecentArticlesQuery,
    RecentArticlesQueryVariables
  >(RecentArticlesDocument, {
    take: 20,
  });

  const articles = result.data?.articles || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <BookOpen className="size-8" />
          Artículos
        </h1>
        <p className="text-muted-foreground">
          Explora nuestro contenido editorial sobre temas legales
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-100 flex-col items-center justify-center gap-2 py-8">
            <Search className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No se encontraron artículos publicados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articulos/${article.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
                {/* Featured Image */}
                {article.featuredImage && (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={article.featuredImage.url}
                      alt={article.featuredImage.alt || article.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}

                <CardHeader>
                  {/* Categories */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {article.categories.slice(0, 2).map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <CardTitle className="line-clamp-2 group-hover:text-primary">
                    {article.title}
                  </CardTitle>

                  {article.excerpt && (
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{formatLongDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{article.readingTimeMin} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="size-4" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={article.author.image || undefined}
                        alt={article.author.name || "Author"}
                      />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-sm">
                      {article.author.name}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
