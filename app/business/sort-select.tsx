"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessSearch } from "@/lib/useBusinessSearch";
import type { BusinessSort } from "@/types/business";

export function SortSelect({ value }: { value: BusinessSort }) {
  const { setFilters } = useBusinessSearch();

  return (
    <Select
      value={value || "relevance"}
      onValueChange={(sort) => setFilters({ sort: sort as BusinessSort })}
    >
      <SelectTrigger className="w-full" aria-label="Ordenar resultados por">
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Relevancia</SelectItem>
        <SelectItem value="rating_desc">Mejor calificados</SelectItem>
        <SelectItem value="rating_asc">Peor calificados</SelectItem>
        <SelectItem value="name_asc">Nombre A-Z</SelectItem>
        <SelectItem value="name_desc">Nombre Z-A</SelectItem>
      </SelectContent>
    </Select>
  );
}