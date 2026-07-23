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
  let municipalityRoutes: MetadataRoute.Sitemap = [];

  // 2. Rutas dinámicas de Negocios
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

  // 3. Rutas dinámicas de Categorías
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

  // 4. Rutas dinámicas de Municipios (Para mejorar SEO Local)
  try {
    const municipalityData: SanityDocumentSlug[] = await client.fetch(
      `*[_type == "municipality" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    );

    console.log(`✅ [Sitemap Oasis] Se encontraron ${municipalityData.length} municipios.`);

    municipalityRoutes = municipalityData.map((item) => ({
      url: `${baseUrl}/municipios/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8, // Prioridad alta (0.8) porque son páginas aterrizaje de SEO local
    }));

  } catch (error) {
    console.error('❌ [Sitemap Oasis] Error consultando municipios en Sanity:', error);
  }

  const allRoutes = [
    ...staticRoutes, 
    ...businessRoutes, 
    ...categoryRoutes,
    ...municipalityRoutes
  ];

  console.log(`✨ [Sitemap Oasis] Proceso finalizado. Total URLs: ${allRoutes.length}`);

  return allRoutes;
}