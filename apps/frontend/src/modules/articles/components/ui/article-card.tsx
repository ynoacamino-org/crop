"use client";

import { Calendar, Clock, Eye, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

interface ArticleCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  readingTimeMin?: number | null;
  views?: number;
  author: {
    name?: string | null;
    image?: string | null;
  };
  featuredImage?: {
    url: string;
    alt?: string | null;
  } | null;
  categories?: Array<{
    name: string;
    slug: string;
  }>;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  publishedAt,
  readingTimeMin,
  views = 0,
  author,
  featuredImage,
  categories = [],
}: ArticleCardProps) {
  const formattedDate = formatLongDate(publishedAt);

  return (
    <Link href={`/articulos/${slug}`}>
      <Card className="group h-full overflow-hidden pt-0 transition-all hover:border-primary/50">
        {featuredImage ? (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-103"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted" />
        )}

        <CardHeader>
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.slug}
                  variant="secondary"
                  className="text-xs"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          <CardTitle className="line-clamp-2 transition-colors group-hover:text-primary">
            {title}
          </CardTitle>

          {excerpt && (
            <CardDescription className="line-clamp-2 text-sm">
              {excerpt}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{author.name || "Anónimo"}</span>
            </div>

            {/* Reading Time */}
            {readingTimeMin && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{readingTimeMin} min</span>
              </div>
            )}

            {/* Views */}
            {views > 0 && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
