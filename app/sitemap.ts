import { MetadataRoute } from 'next';

// 💡 Eliminamos ": MetadataRoute.Sitemap" del nombre de la función para que TypeScript infiera el tipo automáticamente sin chocar
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oasis-directorio-ccg7.vercel.app";

  const routes = [
    '',               
    '/mapa',          
    '/business',      
    '/categorias',    
    '/category',      
    '/municipality',  
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(), // Usar un objeto Date nativo es más seguro para el tipo Sitemap de Next.js
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}