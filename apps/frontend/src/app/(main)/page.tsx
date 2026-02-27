import { Scale } from "lucide-react";
import { RecentCasesList } from "@/modules/legal-cases/components/ui/recent-cases-list";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="border-b pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Jurisprudencia
            </span>
          </div>
          <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            Casos Legales Recientes
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
            Base de datos especializada de jurisprudencia y casos legales del
            sistema judicial peruano. Consulte sentencias, resoluciones y
            precedentes vinculantes.
          </p>
        </div>
      </section>

      {/* Cases List */}
      <section>
        <RecentCasesList initialTake={15} />
      </section>
    </div>
  );
}
