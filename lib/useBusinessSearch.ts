"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import type { BusinessFilters, BusinessSort } from "@/types/business";

const SORT_VALUES: BusinessSort[] = [
  "relevance",
  "rating_desc",
  "rating_asc",
  "name_asc",
  "name_desc",
];

export function useBusinessSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo<BusinessFilters & { page: string }>(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      municipality: searchParams.get("municipality") || "",
      status: searchParams.get("status") || "",
      minRating: searchParams.get("minRating") || "",
      sort: getSafeSort(searchParams.get("sort")),
      hasWhatsapp: searchParams.get("hasWhatsapp") === "true",
      hasAddress: searchParams.get("hasAddress") === "true",
      page: searchParams.get("page") || "1",
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<BusinessFilters & { page: string | number }>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || value === "relevance") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      if (!("page" in updates)) {
        params.delete("page");
      }

      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
        router.refresh();
      });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => router.push(pathname));
  }, [pathname, router]);

  return { filters, setFilters, clearFilters, isPending };
}

function getSafeSort(value: string | null): BusinessSort {
  return SORT_VALUES.includes(value as BusinessSort)
    ? (value as BusinessSort)
    : "relevance";
}
