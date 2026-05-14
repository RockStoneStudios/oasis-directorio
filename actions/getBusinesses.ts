"use server";

import { sanityFetch } from "@/lib/sanity/live";
import { BUSINESS_SEARCH_QUERY } from "@/lib/sanity/queries";
import type {
  BusinessCardData,
  BusinessFilters,
  BusinessSearchResult,
  BusinessSort,
} from "@/types/business";

const DEFAULT_PAGE_SIZE = 12;
const SORT_VALUES: BusinessSort[] = [
  "relevance",
  "rating_desc",
  "rating_asc",
  "name_asc",
  "name_desc",
];

function cleanFilter(value?: string) {
  return value && value !== "all" ? value : "";
}

function cleanFilterList(value?: string) {
  return cleanFilter(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanMinRating(value?: string) {
  const rating = Number(value);
  return Number.isFinite(rating) ? rating : 0;
}

function cleanSort(value: BusinessSort) {
  return SORT_VALUES.includes(value) ? value : "relevance";
}

export async function getBusinesses({
  search = "",
  category = "",
  subcategory = "",
  municipality = "",
  status = "",
  minRating = "",
  sort = "relevance",
  hasWhatsapp = false,
  hasAddress = false,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: BusinessFilters & { page?: number; pageSize?: number } = {}): Promise<BusinessSearchResult> {
  const safeSort = cleanSort(sort);
  const start = Math.max(page - 1, 0) * pageSize;
  const end = start + pageSize + 1;

  const { data } = await sanityFetch({
    query: BUSINESS_SEARCH_QUERY,
    params: {
      search: search.trim(),
      category: cleanFilter(category),
      subcategories: cleanFilterList(subcategory),
      municipality: cleanFilter(municipality),
      status: cleanFilter(status),
      minRating: cleanMinRating(minRating),
      sort: safeSort,
      hasWhatsapp,
      hasAddress,
      start,
      end,
    },
  });

  // Asegurar que data sea un array
  const dataArray = Array.isArray(data) ? data : [];
  
  const businesses = sortBusinesses(dataArray.slice(0, pageSize) as BusinessCardData[], safeSort);

  return {
    businesses,
    page,
    pageSize,
    hasMore: dataArray.length > pageSize,
  };
}

function sortBusinesses(
  businesses: BusinessCardData[],
  sort: BusinessSort,
): BusinessCardData[] {
  if (sort === "name_asc") {
    return [...businesses].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "es"),
    );
  }

  if (sort === "name_desc") {
    return [...businesses].sort((a, b) =>
      (b.name || "").localeCompare(a.name || "", "es"),
    );
  }

  if (sort === "rating_desc") {
    return [...businesses].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  if (sort === "rating_asc") {
    return [...businesses].sort((a, b) => (a.rating || 0) - (b.rating || 0));
  }

  return businesses;
}