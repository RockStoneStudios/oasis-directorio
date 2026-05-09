"use server";

import { sanityFetch } from "@/lib/sanity/live";
import { FEATURED_BUSINESSES_QUERY } from "@/lib/sanity/queries";
import type { BusinessCardData } from "@/types/business";

export async function getFeaturedBusinesses() {
  const { data } = await sanityFetch({ query: FEATURED_BUSINESSES_QUERY });
  return (data || []) as BusinessCardData[];
}
