import type {
  Address,
  Business as SanityBusiness,
  BusinessHours,
  Category,
  GeoPoint,
  LoadedSanityImage,
  Municipality,
  Slug,
  Subcategory,
} from "@/types";

export type BusinessStatus = "open" | "closed" | "temporarily_closed" | "always_open";
export type BusinessSort =
  | "relevance"
  | "rating_desc"
  | "rating_asc"
  | "name_asc"
  | "name_desc";

export interface Business extends SanityBusiness {}

export interface BusinessCardData {
  _id: string;
  name: string;
  slug: Slug | string;
  logo?: LoadedSanityImage | null;
  description?: string | null;
  status?: BusinessStatus | string | null;
  whatsapp?: string | null;
  phone?: string | null;
  rating?: number | null;
  address?: Partial<Address> | null;
  location?: GeoPoint | null;
  municipality?: Partial<Municipality> | null;
  category?: Partial<Category> | null;
  subcategories?: Partial<Subcategory>[] | null;
  isFeatured?: boolean | null;
  isVerified?: boolean | null;
  createdAt?: string | null;
}

export interface BusinessCard extends BusinessCardData {}

export interface BusinessDetail extends BusinessCardData {
  gallery?: LoadedSanityImage[] | null;
  hours?: BusinessHours[] | null;
  facebook?: string | null;
  instagram?: string | null;
  website?: string | null;
}

export interface BusinessFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  municipality?: string;
  status?: string;
  minRating?: string;
  sort?: BusinessSort;
  hasWhatsapp?: boolean;
  hasAddress?: boolean;
}

export interface BusinessPagination {
  page: number;
  pageSize: number;
  start: number;
  end: number;
  hasMore?: boolean;
}

export interface BusinessSearchResult {
  businesses: BusinessCardData[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FilterOption {
  _id: string;
  name: string;
  slug: Slug | string;
  icon?: string | null;
  subcategories?: FilterOption[] | null;
}
