"use client";

import type { PostsQuery } from "@/service/gql/generated/gql.client";
import { usePostsQuery } from "@/service/gql/generated/gql.client";
import { PostCard } from "./post-card";

interface PostsListProps {
  take?: number;
  skip?: number;
  search?: string;
}

export function PostsList({ take = 10, skip = 0, search }: PostsListProps) {
  const [{ data, fetching, error }] = usePostsQuery({
    variables: {
      take,
      skip,
      search,
    },
  });

  if (fetching) {
    return <div>Cargando publicaciones...</div>;
  }

  if (error) {
    return <div>Error al cargar las publicaciones: {error.message}</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.posts.map((post: PostsQuery["posts"][number]) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
