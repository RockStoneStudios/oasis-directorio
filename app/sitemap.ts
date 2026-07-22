import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client'; 

interface SanityDocumentSlug {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

  console.log('🚀 [Sitemap Oasis] Generando mapa de sitio...');

  // 1. Rutas estáticas
  const staticRoutes = [
    '', 
    '/mapa', 
    '/categorias',
    '/estereo',
    '/incendios'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : (route === '/incendios' || route === '/estereo') ? 0.9 : 0.8,
  }));

  let businessRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const businessData: SanityDocumentSlug[] = await client.fetch(
      `*[_type == "business" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    );
    
    console.log(`✅ [Sitemap Oasis] Se encontraron ${businessData.length} negocios.`);

    businessRoutes = businessData.map((item) => ({
      url: `${baseUrl}/business/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  } catch (error) {
    console.error('❌ [Sitemap Oasis] Error consultando negocios en Sanity:', error);
  }

  try {
    const categoryData: SanityDocumentSlug[] = await client.fetch(
      `*[_type == "category" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    );

    console.log(`✅ [Sitemap Oasis] Se encontraron ${categoryData.length} categorías.`);

    categoryRoutes = categoryData.map((item) => ({
      url: `${baseUrl}/categorias/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  } catch (error) {
    console.error('❌ [Sitemap Oasis] Error consultando categorías en Sanity:', error);
  }

  const allRoutes = [...staticRoutes, ...businessRoutes, ...categoryRoutes];

  console.log(`✨ [Sitemap Oasis] Proceso finalizado. Total URLs: ${allRoutes.length}`);

  return allRoutes;
}