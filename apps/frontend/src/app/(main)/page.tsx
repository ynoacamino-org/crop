export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Bienvenido a Crop
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
          Tu aplicación para gestionar contenido multimedia
        </p>
      </div>
    </div>
  );
}
