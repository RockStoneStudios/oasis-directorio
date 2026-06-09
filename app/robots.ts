import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Usamos tu URL de producción por defecto si la variable de entorno no está configurada
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ooasys.com";
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/studio/', // Bloquea el panel de Sanity CMS para que no salga en Google
        '/api/',    // Bloquea tus rutas de API internas
        '/_clerk/', // Bloquea endpoints internos de autenticación de Clerk
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}