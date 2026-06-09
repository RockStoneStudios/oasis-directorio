
import { MetadataRoute } from 'next';
// 💡 Importa tu cliente de Sanity o la función con la que traes tus datos
import { client } from '@/lib/sanity/client'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ooasys.com";

  console.log('🚀 [Sitemap] Iniciando generación de mapa de sitio...');

  // 1. Rutas estáticas base
  const staticRoutes = [
    '', 
    '/mapa', 
    '/categorias',
    '/radio'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  console.log(`📌 [Sitemap] Cargadas ${staticRoutes.length} rutas estáticas base.`);

  let businessRoutes: any[] = [];
  let categoryRoutes: any[] = [];

  try {
    // 2. Traer dinámicamente los slugs de todos los negocios desde Sanity
    console.log('🔍 [Sitemap] Solicitando slugs de negocios a Sanity...');
    const businessSlugs: string[] = await client.fetch(
      `*[_type == "business" && defined(slug.current)].slug.current`
    );
    
    // 🔥 LOG CLAVE: Te dice cuántos negocios trajo y cuáles son sus slugs
    console.log(`✅ [Sitemap] Éxito: Se encontraron ${businessSlugs.length} negocios.`);
    console.log('📋 [Sitemap] Slugs de negocios encontrados:', businessSlugs);

    businessRoutes = businessSlugs.map((slug) => ({
      url: `${baseUrl}/business/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  } catch (error) {
    console.error('❌ [Sitemap] Error al traer los negocios desde Sanity:', error);
  }

  try {
    // 3. Traer dinámicamente los slugs de todas las categorías
    console.log('🔍 [Sitemap] Solicitando slugs de categorías a Sanity...');
    const categorySlugs: string[] = await client.fetch(
      `*[_type == "category" && defined(slug.current)].slug.current`
    );

    // 🔥 LOG CLAVE: Te dice cuántas categorías trajo
    console.log(`✅ [Sitemap] Éxito: Se encontraron ${categorySlugs.length} categorías.`);
    console.log('📋 [Sitemap] Slugs de categorías encontradas:', categorySlugs);

    categoryRoutes = categorySlugs.map((slug) => ({
      url: `${baseUrl}/categorias/${slug}`, // Cámbialo si tu ruta real usa /category/ en vez de /categorias/
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  } catch (error) {
    console.error('❌ [Sitemap] Error al traer las categorías desde Sanity:', error);
  }

  const allRoutes = [...staticRoutes, ...businessRoutes, ...categoryRoutes];
  
  console.log(`✨ [Sitemap] Generación finalizada con éxito. Total de URLs en el sitemap: ${allRoutes.length}`);

  // Juntamos todo en un solo mapa para Google
  return allRoutes;
}