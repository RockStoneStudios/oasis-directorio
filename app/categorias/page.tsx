// // @/app/categorias/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { client } from '@/lib/sanity/client';
// import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from '@/lib/sanity/queries';
// import { urlFor } from '@/lib/sanity/image';
// import { Store, ChevronDown, ChevronRight, Check } from 'lucide-react';

// interface Category {
//   _id: string;
//   name: string;
//   slug: { current: string };
//   image?: {
//     asset?: {
//       url?: string;
//     };
//     alt?: string;
//   };
//   count: number;
// }

// interface Subcategory {
//   _id: string;
//   name: string;
//   slug: { current: string };
// }

// interface CategoryWithSubs {
//   _id: string;
//   name: string;
//   slug: { current: string };
//   subcategories: Subcategory[];
// }

// export default function CategoriasPage() {
//   const router = useRouter();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoriesWithSubs, setCategoriesWithSubs] = useState<CategoryWithSubs[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadCategories() {
//       setLoading(true);
//       try {
//         const categoriesData = await client.fetch(CATEGORIES_WITH_COUNTS_QUERY);
//         setCategories(categoriesData);
        
//         const categoriesWithSubsData = await client.fetch(CATEGORIES_LIST_QUERY);
//         setCategoriesWithSubs(categoriesWithSubsData);
//       } catch (error) {
//         console.error("Error cargando categorías:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadCategories();
//   }, []);

//   const handleCategoryClick = (category: Category, hasSubcategories: boolean) => {
//     if (hasSubcategories) {
//       setExpandedCategory(expandedCategory === category._id ? null : category._id);
//     } else {
//       router.push(`/categorias/${category.slug.current}`);
//     }
//   };

//   const handleSubcategoryClick = (subcategorySlug: string) => {
//     router.push(`/categorias/${subcategorySlug}`);
//   };

//   const getSubcategories = (categoryId: string) => {
//     const category = categoriesWithSubs.find(cat => cat._id === categoryId);
//     return category?.subcategories || [];
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-2">Directorio por Categorías</h1>
//       <p className="text-gray-500 mb-8">
//         Selecciona una categoría o subcategoría para ver los negocios relacionados.
//       </p>

//       {loading ? (
//         <div className="text-center py-12">Cargando categorías...</div>
//       ) : (
//         <div className="flex flex-col gap-6">
//           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {categories.map((category) => {
//               const subcategories = getSubcategories(category._id);
//               const isExpanded = expandedCategory === category._id;
//               const hasSubcategories = subcategories.length > 0;
              
//               return (
//                 <div key={category._id} className="flex flex-col h-full">
//                   <div
//                     onClick={() => handleCategoryClick(category, hasSubcategories)}
//                     className={`relative overflow-hidden rounded-2xl border bg-linear-to-br from-card to-card/80 p-3 sm:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-full select-none ${
//                       isExpanded ? 'border-primary/40 shadow-md ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/20'
//                     }`}
//                   >
//                     <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
//                     <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 h-full">
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                         <div className="relative h-10 w-10 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-primary/10 to-primary/5 shadow-md">
//                           {category.image?.asset?.url ? (
//                             <Image
//                               src={urlFor(category.image).width(56).height(56).url()}
//                               alt={category.image.alt || category.name}
//                               fill
//                               sizes="(max-width: 640px) 40px, 56px"
//                               className="object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center">
//                               <Store className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
//                             </div>
//                           )}
//                         </div>
                        
//                         <div>
//                           <h3 className="text-sm sm:text-lg font-bold text-card-foreground line-clamp-2">
//                             {category.name}
//                           </h3>
                          
//                           <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
//                             <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
//                             <span className="text-xs sm:text-sm font-medium text-primary">
//                               {category.count} {category.count === 1 ? 'negocio' : 'negocios'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {hasSubcategories && (
//                         <div className="text-muted-foreground absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto">
//                           {isExpanded ? (
//                             <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
//                           ) : (
//                             <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
//                           )}
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0" />
//                   </div>

//                   {/* SUB-BLOQUE DE SUBCATEGORÍAS */}
//                   {isExpanded && hasSubcategories && (
//                     <div className="mt-2 ml-1 p-2 rounded-xl bg-muted/40 border border-border/40 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
//                       <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-2 mb-1">Subcategorías:</p>
//                       {subcategories.map((sub) => (
//                         <div
//                           key={sub._id}
//                           onClick={(e) => {
//                             e.stopPropagation(); // Frena la tarjeta madre
//                             handleSubcategoryClick(sub.slug.current);
//                           }}
//                           className="flex items-center gap-2 p-2 rounded-lg hover:bg-background border border-transparent hover:border-border/60 cursor-pointer transition-all active:scale-95 group/sub"
//                         >
//                           {/* 🚀 MODIFICADO: Checkbox vacío por defecto (`text-transparent`). Al hacer hover cambia a verde con el chulito */}
//                           <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center bg-background shrink-0 group-hover/sub:border-primary group-hover/sub:bg-primary/10 transition-all duration-200">
//                             <Check className="h-3 w-3 text-transparent group-hover/sub:text-primary transition-colors" />
//                           </div>
                          
//                           <span className="text-xs sm:text-sm text-card-foreground font-medium flex-1 line-clamp-1 group-hover/sub:text-primary transition-colors">
//                             {sub.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// @/app/categorias/page.tsx
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNTS_QUERY, CATEGORIES_LIST_QUERY } from "@/lib/sanity/queries";
import { Store } from "lucide-react";
import { CategoryGrid } from "@/components/category/CategoryGrid";

// Revalida los datos de Sanity automáticamente cada 60 segundos
export const revalidate = 60;

// 🚀 METADATOS ULTRA ENFOCADOS EN EL OCCIDENTE ANTIOQUEÑO PARA GOOGLE
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";
  const title = "Categorías de Negocios en el Occidente Antioqueño | Oasis";
  const description = "Descubre los mejores comercios y servicios del Occidente Antioqueño. Encuentra dónde comer, hoteles, fincas de recreo, salud y turismo en Sopetrán, San Jerónimo, Santa Fe de Antioquia y más.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/categorias`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categorias`,
      type: "website",
      siteName: "Oasis",
      locale: "es_CO",
      images: [
        {
          url: `${baseUrl}/oasis.png`,
          width: 1200,
          height: 630,
          alt: "Directorio de Negocios en el Occidente Antioqueño - Oasis",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-categories.png`],
    },
  };
}

export default async function CategoriasPage() {
  // Peticiones en paralelo directo en el servidor (Carga instantánea)
  const [categoriesData, categoriesWithSubsData] = await Promise.all([
    client.fetch(CATEGORIES_WITH_COUNTS_QUERY),
    client.fetch(CATEGORIES_LIST_QUERY),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";

  // 🚀 DATOS ESTRUCTURADOS (JSON-LD) PARA POSICIONAR LA GUÍA REGIONAL
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": "Guía Comercial y Turística del Occidente Antioqueño - Oasis",
    "description": "Clasificación oficial de establecimientos comerciales, gastronómicos, hoteles y servicios en la subregión del Occidente.",
    "url": `${baseUrl}/categorias`,
    "inLanguage": "es-CO",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoriesData?.length || 0,
      "itemListElement": (categoriesData || []).map((cat: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${cat.name} en el Occidente Antioqueño`,
        "url": `${baseUrl}/categorias/${cat.slug?.current || ""}`
      }))
    }
  };

  return (
    <div className="bg-linear-to-b from-accent/10 via-background to-background min-h-screen">
      {/* Inyección Semántica en el Head para los robots de Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header Atractivo y Regional */}
      <header className="relative overflow-hidden border-b border-border/40 bg-background/60 backdrop-blur-md py-12 md:py-16">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
            <Store className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-heading sm:text-5xl md:text-6xl text-foreground">
            Explora por <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Categorías</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            ¿Buscas dónde comer, un hotel con piscina o un servicio confiable en el Occidente? Selecciona un sector y descubre locales recomendados en la región.
          </p>
        </div>
      </header>

      {/* Grilla interactiva del lado del cliente */}
      <main className="container mx-auto px-4 py-10 md:py-14">
        <CategoryGrid 
          initialCategories={categoriesData || []} 
          categoriesWithSubs={categoriesWithSubsData || []} 
        />
      </main>
    </div>
  );
}