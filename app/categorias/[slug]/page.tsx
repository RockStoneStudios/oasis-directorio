'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { client } from '@/lib/sanity/client';
// Importa la nueva query aquí
import { BUSINESS_BY_SUBCATEGORY_QUERY } from '@/lib/sanity/queries';
import { BusinessCard } from '@/components/BusinessCard';
import { ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';

export default function CategoryBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      
      try {
        // 1. Ejecutamos la query inversa
        const data = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
        setBusinesses(data);

        // 2. Intentamos obtener el nombre bonito de la categoría/subcategoría
        // Si hay negocios, sacamos el nombre de la categoría del primer negocio
        if (data.length > 0) {
          // Buscamos si el slug coincide con la categoría principal o una sub
          const firstBiz = data[0];
          setTitle(firstBiz.category?.slug?.current === slug 
            ? firstBiz.category.name 
            : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
          );
        } else {
          setTitle(slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
        }
      } catch (error) {
        console.error("Error cargando negocios:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {loading ? 'Buscando...' : `${businesses.length} ${businesses.length === 1 ? 'negocio encontrado' : 'negocios encontrados'} en esta sección.`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/20">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-muted-foreground">Aún no hay negocios en "{title}"</p>
          <Link href="/categorias" className="text-primary hover:underline mt-4 inline-block font-semibold">
            Explorar otras categorías
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