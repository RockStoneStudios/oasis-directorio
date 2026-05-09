"use server";

import { sanityFetch } from "@/lib/sanity/live";
import { BUSINESS_DETAIL_QUERY } from "@/lib/sanity/queries";
import type { BusinessDetail } from "@/types/business";

export async function getBusinessBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: BUSINESS_DETAIL_QUERY,
    params: { slug, id: slug },
  });

  return data as BusinessDetail | null;
}
