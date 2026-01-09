import { Navbar, PostsList } from "@/modules/posts/components";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-4xl">Posts</h1>
          <p className="text-muted-foreground">
            Explora todos los posts de la comunidad
          </p>
        </div>

        <PostsList take={12} />
      </main>
    </div>
  );
}
