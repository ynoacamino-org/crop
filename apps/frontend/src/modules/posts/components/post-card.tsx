"use client";

import type { PostsQuery } from "@/gql/generated/gql.client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { getInitials } from "@/shared/lib/utils";

type Post = PostsQuery["posts"][number];

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden pt-0">
      {post.image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.author.image || undefined}
              alt={post.author.name || "User"}
            />
            <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium text-sm leading-none">
              {post.author.name}
            </p>
            <p className="text-muted-foreground text-xs">{post.author.email}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="mb-2 font-bold text-xl">{post.title}</h3>
        {post.description && (
          <p className="line-clamp-3 text-muted-foreground text-sm">
            {post.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="text-muted-foreground text-xs">
        {new Date(post.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </CardFooter>
    </Card>
  );
}
