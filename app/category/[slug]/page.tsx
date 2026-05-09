import { Grid3X3, Store } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/lib/sanity/live";
import { CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { getSlugValue } from "@/lib/formatBusinessData";
import type { FilterOption } from "@/types/business";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: CATEGORIES_LIST_QUERY });
  const category = (data || []).find(
    (item: FilterOption) => getSlugValue(item.slug) === slug,
  );

  return {
    title: category ? `${category.name}` : "Categoria",
    description: `Negocios locales en la categoria ${category?.name || slug}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(Number(query.page) || 1, 1);
  const [{ businesses, hasMore }, { data: categories }] = await Promise.all([
    getBusinesses({ category: slug, page, pageSize: 12 }),
    sanityFetch({ query: CATEGORIES_LIST_QUERY }),
  ]);
  const category = (categories || []).find(
    (item: FilterOption) => getSlugValue(item.slug) === slug,
  );
  const subcategories = (category as any)?.subcategories || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main" className="bg-accent/20">
        <header className="border-b border-border/50 bg-background">
          <div className="container py-10">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Grid3X3 className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">Categoria</span>
            </div>
            <h1 className="text-3xl font-bold font-heading md:text-4xl">
              {category?.icon ? `${category.icon} ` : ""}
              {category?.name || slug}
            </h1>
            {subcategories.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {subcategories.map((subcategory: any) => (
                  <Badge key={subcategory._id} variant="outline">
                    {subcategory.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="container py-10">
          {businesses.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
              <Pagination
                page={page}
                hasMore={hasMore}
                basePath={`/category/${slug}`}
                searchParams={query}
              />
            </>
          ) : (
            <EmptyDirectory />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EmptyDirectory() {
  return (
    <div className="rounded-2xl border border-border/50 bg-background p-12 text-center shadow-warm">
      <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-xl font-semibold font-heading">
        No hay negocios en esta categoria
      </h2>
      <p className="mt-2 text-muted-foreground">
        Prueba otra categoria o vuelve mas tarde.
      </p>
    </div>
  );
}
