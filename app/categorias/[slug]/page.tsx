// app/directorio/categorias/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { client } from '@/lib/sanity/client';
import { BUSINESS_SEARCH_QUERY, CATEGORIES_LIST_QUERY } from '@/lib/sanity/queries';
import { BusinessCard } from '@/components/BusinessCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

export default function CategoryBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // Obtener todas las categorías para encontrar la actual
      const categories = await client.fetch(CATEGORIES_LIST_QUERY);
      const currentCategory = categories.find((cat: Category) => cat.slug.current === slug);
      setCategory(currentCategory || null);
      
      // Obtener negocios de esta categoría
      if (currentCategory) {
        const data = await client.fetch(BUSINESS_SEARCH_QUERY, {
          category: slug,
          subcategories: [],
          municipality: '',
          status: '',
          minRating: 0,
          hasWhatsapp: false,
          hasAddress: false,
          search: '',
          sort: 'name_asc',
          start: 0,
          end: 100,
        });
        setBusinesses(data);
      }
      
      setLoading(false);
    }
    
    if (slug) {
      loadData();
    }
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a categorías
      </button>

      <h1 className="text-3xl font-bold mb-2">
        {category?.name || 'Categoría'}
      </h1>
      <p className="text-gray-500 mb-8">
        {businesses.length} {businesses.length === 1 ? 'negocio encontrado' : 'negocios encontrados'}
      </p>

      {loading ? (
        <div className="text-center py-12">Cargando negocios...</div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay negocios en esta categoría aún.</p>
          <Link href="/directorio/categorias" className="text-blue-600 hover:underline mt-2 inline-block">
            Ver todas las categorías
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}