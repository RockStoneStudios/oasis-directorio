import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client'; 

export const revalidate = 86400; 

interface SanityDocumentSlug {
  slug: string;
  updatedAt?: string;
}

interface BusinessCombo {
  categorySlug: string;
  muniSlug: string;
}

function safeSlug(slug: string): string {
  return encodeURIComponent(slug.trim());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  const staticRoutes = [
    { route: '', lastModified: '2026-07-29', changeFrequency: 'daily' as const, priority: 1.0 },
    { route: '/mapa', lastModified: '2026-07-30', changeFrequency: 'weekly' as const, priority: 0.8 },
    { route: '/categorias', lastModified: '2026-07-24', changeFrequency: 'monthly' as const, priority: 0.8 },
    { route: '/estereo', lastModified: '2026-07-30', changeFrequency: 'monthly' as const, priority: 0.9 },
    { route: '/incendios', lastModified: '2026-07-29', changeFrequency: 'daily' as const, priority: 0.9 },
    { route: '/preguntas-frecuentes', lastModified: '2026-09-01', changeFrequency: 'monthly' as const, priority: 0.8 },
    { route: '/feria-del-tamarindo-2026', lastModified: '2026-08-12', changeFrequency: 'weekly' as const, priority: 1.0 },
    { route: '/fiestas-san-diego-liborina', lastModified: '2026-10-27', changeFrequency: 'weekly' as const, priority: 1.0 },
    { route: '/fiestas-del-sol-san-jeronimo', lastModified: '2026-10-27', changeFrequency: 'weekly' as const, priority: 1.0 },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  let businessRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let municipalityRoutes: MetadataRoute.Sitemap = [];
  let categoryMuniRoutes: MetadataRoute.Sitemap = [];

  const [
    businessResult,
    categoryResult,
    municipalityResult,
    comboResult,
  ] = await Promise.allSettled([
    client.fetch<SanityDocumentSlug[]>(`*[_type == "business" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    client.fetch<SanityDocumentSlug[]>(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    client.fetch<SanityDocumentSlug[]>(`*[_type == "municipality" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    // ✅ SOLO COMBINACIONES REALES QUE SÍ TIENEN NEGOCIOS
    client.fetch<BusinessCombo[]>(`*[_type == "business" && defined(category->slug.current) && defined(municipality->slug.current)]{ "categorySlug": category->slug.current, "muniSlug": municipality->slug.current }`),
  ]);

  if (businessResult.status === "fulfilled") {
    businessRoutes = businessResult.value.map((item) => ({
      url: `${baseUrl}/business/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }

  if (categoryResult.status === "fulfilled") {
    categoryRoutes = categoryResult.value.map((item) => ({
      url: `${baseUrl}/categorias/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  }

  if (municipalityResult.status === "fulfilled") {
    municipalityRoutes = municipalityResult.value.map((item) => ({
      url: `${baseUrl}/municipios/${safeSlug(item.slug)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  }

  // ✅ COMBINACIONES CATEGORIA + MUNICIPIO - SOLO SI HAY NEGOCIO
  if (comboResult.status === "fulfilled") {
    const seen = new Set<string>();
    comboResult.value.forEach((item) => {
      const key = `${item.categorySlug}/${item.muniSlug}`;
      if (!seen.has(key) && item.categorySlug && item.muniSlug) {
        seen.add(key);
        categoryMuniRoutes.push({
          url: `${baseUrl}/categorias/${safeSlug(item.categorySlug)}/${safeSlug(item.muniSlug)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });
      }
    });
    console.log(`✅ Combinaciones reales generadas: ${categoryMuniRoutes.length}`);
  }

  const allRoutes = [
    ...staticRoutes, 
    ...businessRoutes, 
    ...categoryRoutes,
    ...municipalityRoutes,
    ...categoryMuniRoutes,
  ];

  const uniqueRoutes = [...new Map(allRoutes.map((r) => [r.url, r])).values()];
  uniqueRoutes.sort((a, b) => a.url.localeCompare(b.url));

  return uniqueRoutes;
}