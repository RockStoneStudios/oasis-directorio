import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client'; 

// 1. CACHEO: Solo se regenera cada 24 horas, ahorra consultas a Sanity
export const revalidate = 86400; 

interface SanityDocumentSlug {
  slug: string;
  updatedAt?: string;
}

// 2. SEGURIDAD: Evita que un slug con espacios rompa el XML
function safeSlug(slug: string): string {
  return encodeURIComponent(slug.trim());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 🛡️ Seguridad: Si la variable de entorno tiene una barra al final, la quitamos para evitar // o ///
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  console.log('🚀 [Sitemap Ooasys] Generando mapa de sitio...');

  // 3. FECHAS REALES Y RUTAS ESTÁTICAS
  const staticRoutes = [
    { route: '', lastModified: '2026-07-29', changeFrequency: 'daily' as const, priority: 1.0 },
    { route: '/mapa', lastModified: '2026-07-30', changeFrequency: 'weekly' as const, priority: 0.8 },
    { route: '/categorias', lastModified: '2026-07-24', changeFrequency: 'monthly' as const, priority: 0.8 },
    { route: '/estereo', lastModified: '2026-07-30', changeFrequency: 'monthly' as const, priority: 0.9 },
    { route: '/incendios', lastModified: '2026-07-29', changeFrequency: 'daily' as const, priority: 0.9 },
    // ✅ RUTA DE PREGUNTAS FRECUENTES (FAQ)
    { route: '/preguntas-frecuentes', lastModified: '2026-09-01', changeFrequency: 'monthly' as const, priority: 0.8 },
    // ✅ RUTA DE LA VIRGEN MORENA
    { route: '/virgen-morena-sopetran-programacion-2026', lastModified: '2026-07-31', changeFrequency: 'weekly' as const, priority: 1.0 },
    // ✅ RUTA DE OLAYA
    { route: '/fiestas-olaya-2026', lastModified: '2026-08-07', changeFrequency: 'weekly' as const, priority: 1.0 },
    // ✅ RUTA DE LA FERIA DEL TAMARINDO
    { route: '/feria-del-tamarindo-2026', lastModified: '2026-08-12', changeFrequency: 'weekly' as const, priority: 1.0 },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  let businessRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let municipalityRoutes: MetadataRoute.Sitemap = [];

  // 4. PROMESAS EN PARALELO Y SEGUROS
  console.log('🔍 [Sitemap Ooasys] Consultando datos dinámicos a Sanity...');

  const [
    businessResult,
    categoryResult,
    municipalityResult,
  ] = await Promise.allSettled([
    client.fetch<SanityDocumentSlug[]>(`*[_type == "business" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    client.fetch<SanityDocumentSlug[]>(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    client.fetch<SanityDocumentSlug[]>(`*[_type == "municipality" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`)
  ]);

  // --- Procesamiento de Negocios ---
  if (businessResult.status === "fulfilled") {
    const businessData = businessResult.value;
    console.log(`✅ [Sitemap Ooasys] Se encontraron ${businessData.length} negocios.`);
    businessRoutes = businessData.map((item) => ({
      url: `${baseUrl}/business/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } else {
    console.error('❌ [Sitemap Ooasys] Error consultando negocios en Sanity:', businessResult.reason);
  }

  // --- Procesamiento de Categorías ---
  if (categoryResult.status === "fulfilled") {
    const categoryData = categoryResult.value;
    console.log(`✅ [Sitemap Ooasys] Se encontraron ${categoryData.length} categorías.`);
    categoryRoutes = categoryData.map((item) => ({
      url: `${baseUrl}/categorias/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } else {
    console.error('❌ [Sitemap Ooasys] Error consultando categorías en Sanity:', categoryResult.reason);
  }

  // --- Procesamiento de Municipios ---
  if (municipalityResult.status === "fulfilled") {
    const municipalityData = municipalityResult.value;
    console.log(`✅ [Sitemap Ooasys] Se encontraron ${municipalityData.length} municipios.`);
    municipalityRoutes = municipalityData.map((item) => ({
      url: `${baseUrl}/municipios/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } else {
    console.error('❌ [Sitemap Ooasys] Error consultando municipios en Sanity:', municipalityResult.reason);
  }

  const allRoutes = [
    ...staticRoutes, 
    ...businessRoutes, 
    ...categoryRoutes,
    ...municipalityRoutes
  ];

  // 5. LIMPIEZA: Elimina posibles duplicados
  const uniqueRoutes = [...new Map(allRoutes.map((r) => [r.url, r])).values()];

  // 6. ORDENAMIENTO: Un XML ordenado
  uniqueRoutes.sort((a, b) => a.url.localeCompare(b.url));

  console.log(`✨ [Sitemap Ooasys] Proceso finalizado. Total URLs generadas: ${uniqueRoutes.length}`);

  return uniqueRoutes;
}