import { FileText, Scale } from "lucide-react";
import { RecentArticlesList } from "@/modules/articles/components/ui/recent-articles-list";
import { RecentCasesList } from "@/modules/legal-cases/components/ui/recent-cases-list";

export default function HomePage() {
  return (
    <div className="space-y-12">
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
            Base de Datos Legal
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
            Consulta jurisprudencia, casos legales y análisis especializados del
            sistema judicial peruano. Sentencias, resoluciones y precedentes
            vinculantes.
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-2xl">Artículos Recientes</h2>
        </div>
        <RecentArticlesList take={6} />
      </section>

      {/* Legal Cases Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-2xl">Casos Legales Recientes</h2>
        </div>
        <RecentCasesList take={4} />
      </section>
    </div>
  );
}
