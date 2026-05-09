"use client";

import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useBusinessSearch } from "@/lib/useBusinessSearch";

interface BusinessSearchBarProps {
  placeholder?: string;
}

export function BusinessSearchBar({
  placeholder = "Buscar negocio, producto o servicio...",
}: BusinessSearchBarProps) {
  const { filters, setFilters } = useBusinessSearch();
  const [value, setValue] = useState(filters.search || "");

  useEffect(() => {
    setValue(filters.search || "");
  }, [filters.search]);

  const debouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        setFilters({ search });
      }, 350),
    [setFilters],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  return (
    <div className="relative w-full">
      <label htmlFor="business-search" className="sr-only">
        Buscar negocios
      </label>
      <Search
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="business-search"
        name="search"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className="h-12 pl-12 text-base"
        onChange={(event) => {
          setValue(event.target.value);
          debouncedSearch(event.target.value);
        }}
      />
    </div>
  );
}
