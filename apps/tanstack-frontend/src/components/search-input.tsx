import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as any;
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.search || "");

  const handleSearch = (term: string) => {
    startTransition(() => {
      navigate({
        search: {
          ...searchParams,
          search: term || undefined,
          offset: undefined, // Reset page
        },
      } as any);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    startTransition(() => {
      navigate({
        search: {
          ...searchParams,
          search: undefined,
          offset: undefined,
        },
      } as any);
    });
  };

  useEffect(() => {
    const currentSearch = searchParams.search || "";
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
        className="pr-9 pl-9"
      />
      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {isPending && (
        <div className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      )}
    </div>
  );
}
