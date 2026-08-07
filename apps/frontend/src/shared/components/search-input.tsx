import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, unknown>;
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    (searchParams.search as string) || "",
  );

  const handleSearch = (term: string) => {
    startTransition(() => {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          search: term || undefined,
          offset: undefined, // Reset page
        }),
      } as never);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    startTransition(() => {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          search: undefined,
          offset: undefined,
        }),
      } as never);
    });
  };

  useEffect(() => {
    const currentSearch = (searchParams.search as string) || "";
    setSearchValue(currentSearch);
  }, [searchParams.search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  return (
    <div className={`relative flex items-center ${className || ""}`}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pr-10 pl-9"
        aria-label={placeholder || "Buscar jurisprudencia o artículos"}
      />
      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="touch-target absolute right-1 h-9 min-h-[36px] w-9 min-w-[36px]"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {isPending && (
        <div className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent motion-reduce:animate-none" />
      )}
    </div>
  );
}
