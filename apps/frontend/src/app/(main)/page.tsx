import { CreatePostButton, PostsList } from "@/modules/posts/components";

export default function Home() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Posts</h1>
        <p className="text-muted-foreground">
          Explora todos los posts de la comunidad
        </p>
      </div>

      <PostsList take={12} />
      <CreatePostButton />
    </>
  );
}
