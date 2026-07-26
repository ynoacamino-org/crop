import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Search,
  title = "No se encontraron resultados",
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-100 flex-col items-center justify-center gap-2 py-12",
        className,
      )}
    >
      <Icon className="size-12 text-muted-foreground" />
      <p className="text-muted-foreground">{title}</p>
      {description && (
        <p className="text-center text-muted-foreground text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
