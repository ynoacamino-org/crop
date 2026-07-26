"use client";

import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar por nombre, número o partes...",
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSearch = useCallback(() => {
    onSearch(query.trim());
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-9 pl-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpiar búsqueda</span>
          </Button>
        )}
      </div>
      <Button onClick={handleSearch} variant="default">
        Buscar
      </Button>
    </div>
  );
}
