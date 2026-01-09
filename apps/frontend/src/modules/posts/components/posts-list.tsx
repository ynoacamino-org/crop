import { PostsDocument } from "@/gql/generated/gql.node";
import { getService } from "@/gql/service.server";
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
  const posts = await service
    .query(PostsDocument, { search, take, skip })
    .toPromise();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts?.data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
