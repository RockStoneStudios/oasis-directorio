// app/categorias/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/lib/sanity/client';
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import { Store, ChevronDown, ChevronRight, Check } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  image?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
  count: number;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface CategoryWithSubs {
  _id: string;
  name: string;
  slug: { current: string };
  subcategories: Subcategory[];
}

export default function CategoriasPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesWithSubs, setCategoriesWithSubs] = useState<CategoryWithSubs[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      
      const categoriesData = await client.fetch(CATEGORIES_WITH_COUNTS_QUERY);
      setCategories(categoriesData);
      
      const categoriesWithSubsData = await client.fetch(CATEGORIES_LIST_QUERY);
      setCategoriesWithSubs(categoriesWithSubsData);
      
      setLoading(false);
    }
    loadCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (subcategorySlug: string) => {
    // Redirige a /business/[slug]
    router.push(`/business/${subcategorySlug}`);
  };

  const getSubcategories = (categoryId: string) => {
    const category = categoriesWithSubs.find(cat => cat._id === categoryId);
    return category?.subcategories || [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Directorio por Categorías</h1>
      <p className="text-gray-500 mb-8">
        Selecciona una subcategoría para ver los negocios relacionados.
      </p>

      {loading ? (
        <div className="text-center py-12">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const subcategories = getSubcategories(category._id);
            const isExpanded = expandedCategory === category._id;
            const hasSubcategories = subcategories.length > 0;
            
            return (
              <div key={category._id} className="group">
                <div
                  onClick={() => toggleCategory(category._id)}
                  className="relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-card to-card/80 p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/20 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-primary/10 to-primary/5 shadow-md group-hover:shadow-lg transition-all">
                        {category.image?.asset?.url ? (
                          <Image
                            src={urlFor(category.image).width(56).height(56).url()}
                            alt={category.image.alt || category.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Store className="h-7 w-7 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                          <span className="text-sm font-medium text-primary">
                            {category.count} {category.count === 1 ? 'negocio' : 'negocios'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {hasSubcategories && (
                      <div className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 group-hover:via-primary/40 transition-all" />
                </div>

                {isExpanded && hasSubcategories && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-primary/20 space-y-2">
                    {subcategories.map((sub) => (
                      <div
                        key={sub._id}
                        onClick={() => handleSubcategoryClick(sub.slug.current)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group/sub"
                      >
                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover/sub:border-primary transition-colors">
                          <Check className="h-3 w-3 text-transparent group-hover/sub:text-primary" />
                        </div>
                        <span className="text-sm text-card-foreground flex-1">
                          {sub.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}