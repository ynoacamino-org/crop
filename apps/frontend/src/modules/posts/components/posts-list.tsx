import type { PostsQuery } from "@/service/gql/generated/gql.node";
import { PostsDocument } from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import { PostCard } from "./post-card";

interface PostsListProps {
  take?: number;
  skip?: number;
  search?: string;
}

export async function PostsList({
  take = 10,
  skip = 0,
  search,
}: PostsListProps) {
  const service = await getService();
  const posts = await service.gql
    .query(PostsDocument, { search, take, skip })
    .toPromise();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts?.data?.posts.map((post: PostsQuery["posts"][number]) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
