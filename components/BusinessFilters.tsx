"use client";

import {
  Building2,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessSearch } from "@/lib/useBusinessSearch";
import type { BusinessFilters as BusinessFilterState } from "@/types/business";
import type { FilterOption } from "@/types/business";

const BUSINESS_STATUS = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Abierto" },
  { value: "closed", label: "Cerrado" },
  { value: "temporarily_closed", label: "Temporalmente cerrado" },
];

const RATING_OPTIONS = [
  { value: "all", label: "Cualquier rating" },
  { value: "4", label: "4+ estrellas" },
  { value: "3", label: "3+ estrellas" },
  { value: "2", label: "2+ estrellas" },
  { value: "1", label: "1+ estrellas" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "rating_desc", label: "Mejor calificados" },
  { value: "rating_asc", label: "Peor calificados" },
  { value: "name_asc", label: "Nombre A-Z" },
  { value: "name_desc", label: "Nombre Z-A" },
];

interface BusinessFiltersProps {
  categories: FilterOption[];
  municipalities: FilterOption[];
}

export function BusinessFilters({
  categories,
  municipalities,
}: BusinessFiltersProps) {
  const { filters, setFilters, clearFilters, isPending } = useBusinessSearch();
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(
    Boolean(
      filters.minRating ||
        filters.sort !== "relevance" ||
        filters.hasWhatsapp ||
        filters.hasAddress,
    ),
  );

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) => getOptionSlug(category) === filters.category,
      ),
    [categories, filters.category],
  );

  const subcategories = selectedCategory?.subcategories || [];
  const selectedSubcategories = useMemo(
    () => filters.subcategory?.split(",").filter(Boolean) || [],
    [filters.subcategory],
  );

  const hasFilters = Boolean(
    filters.search ||
      filters.category ||
      selectedSubcategories.length > 0 ||
      filters.municipality ||
      filters.status ||
      filters.minRating ||
      filters.sort !== "relevance" ||
      filters.hasWhatsapp ||
      filters.hasAddress,
  );

  const advancedFiltersCount = [
    filters.minRating,
    filters.sort !== "relevance",
    filters.hasWhatsapp,
    filters.hasAddress,
  ].filter(Boolean).length;

  const updateFilters = (updates: Partial<BusinessFilterState>) => {
    setFilters(sanitizeFilters(updates));
  };

  const toggleSubcategory = (subcategory: string) => {
    const nextSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((current) => current !== subcategory)
      : [...selectedSubcategories, subcategory];

    updateFilters({ subcategory: nextSubcategories.join(",") });
  };

  return (
    <aside className="rounded-2xl border border-border/50 bg-background p-6 shadow-warm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold font-heading">Filtros</h2>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sidebar-business-search">Buscar negocio</Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="sidebar-business-search"
              value={filters.search || ""}
              placeholder="Nombre, producto o servicio..."
              className="pl-10"
              onChange={(event) => updateFilters({ search: event.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-filter" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Categoria
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(category) =>
              updateFilters({ category, subcategory: "" })
            }
          >
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorias</SelectItem>
              {categories
                .filter((category) => getOptionSlug(category))
                .map((category) => (
                  <SelectItem key={category._id} value={getOptionSlug(category)}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Tags className="h-4 w-4" aria-hidden="true" />
            Subcategorias
          </Label>
          {!filters.category ? (
            <p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Elige una categoria para ver subcategorias.
            </p>
          ) : subcategories.length > 0 ? (
            <div className="space-y-2 rounded-md border border-border/60 p-3">
              {subcategories
                .filter((subcategory) => getOptionSlug(subcategory))
                .map((subcategory) => {
                  const slug = getOptionSlug(subcategory);

                  return (
                    <div
                      key={subcategory._id}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`subcategory-${slug}`}
                        checked={selectedSubcategories.includes(slug)}
                        onCheckedChange={() => toggleSubcategory(slug)}
                      />
                      <Label
                        htmlFor={`subcategory-${slug}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {subcategory.name}
                      </Label>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Esta categoria no tiene subcategorias.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="municipality-filter"
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Municipio
          </Label>
          <Select
            value={filters.municipality || "all"}
            onValueChange={(municipality) => updateFilters({ municipality })}
          >
            <SelectTrigger id="municipality-filter" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los municipios</SelectItem>
              {municipalities
                .filter((municipality) => getOptionSlug(municipality))
                .map((municipality) => (
                  <SelectItem
                    key={municipality._id}
                    value={getOptionSlug(municipality)}
                  >
                    {municipality.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter" className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Estado
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(status) => updateFilters({ status })}
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Collapsible open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-accent/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                Mas filtros
                {advancedFiltersCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {advancedFiltersCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  moreFiltersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="rating-filter">Calificacion minima</Label>
              <Select
                value={filters.minRating || "all"}
                onValueChange={(minRating) => updateFilters({ minRating })}
              >
                <SelectTrigger id="rating-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATING_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-filter">Ordenar por</Label>
              <Select
                value={filters.sort || "relevance"}
                onValueChange={(sort) =>
                  updateFilters({ sort: sort as BusinessFilterState["sort"] })
                }
              >
                <SelectTrigger id="sort-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-whatsapp-filter"
                  checked={filters.hasWhatsapp}
                  onCheckedChange={(checked) =>
                    updateFilters({ hasWhatsapp: checked === true })
                  }
                />
                <Label
                  htmlFor="has-whatsapp-filter"
                  className="cursor-pointer text-sm"
                >
                  Tiene WhatsApp
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-address-filter"
                  checked={filters.hasAddress}
                  onCheckedChange={(checked) =>
                    updateFilters({ hasAddress: checked === true })
                  }
                />
                <Label
                  htmlFor="has-address-filter"
                  className="cursor-pointer text-sm"
                >
                  Tiene direccion
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          disabled={!hasFilters || isPending}
        >
          Limpiar filtros
        </Button>
      </div>
    </aside>
  );
}

function sanitizeFilters(updates: Partial<BusinessFilterState>) {
  return Object.fromEntries(
    Object.entries(updates).map(([key, value]) => [
      key,
      value === "" ? "all" : value,
    ]),
  ) as Partial<BusinessFilterState>;
}

function getOptionSlug(option: FilterOption) {
  return typeof option.slug === "string" ? option.slug : option.slug.current;
}
