"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
      // Reset to first page when searching
      params.delete("offset");
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("offset");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchValue(currentSearch);
  }, [searchParams]);

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
