import { Scale, TrendingUp } from "lucide-react";
import { RecentCasesList } from "@/modules/legal-cases/components/ui/recent-cases-list";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary text-sm">
          <TrendingUp className="h-4 w-4" />
          <span>Casos Legales Recientes</span>
        </div>
        <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Jurisprudencia Nacional
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
          Explora los casos legales más recientes y relevantes de la
          jurisdicción peruana
        </p>
      </section>

      {/* Featured Badge */}
      <section className="flex items-center gap-2 border-b pb-4">
        <Scale className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-2xl">Últimos Casos</h2>
      </section>

      {/* Cases Grid */}
      <RecentCasesList take={12} />
    </div>
  );
}
