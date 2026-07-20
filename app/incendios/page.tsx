// app/incendios/page.tsx
import { Metadata } from 'next';
import IncendiosMapClient from '@/components/incendios/IncendiosMapViewComponent';

// 🔥 METADATOS ULTRA OPTIMIZADOS
export const metadata: Metadata = {
  title: {
    default: 'Monitoreo Térmico Satelital Antioquia | Incendios Forestales en Tiempo Real',
    template: '%s | Ooasys'
  },
  description: 'Mapa interactivo de detección de incendios forestales en el Cañón del Cauca y occidente antioqueño. Datos satelitales VIIRS NASA FIRMS en tiempo real. Alertas térmicas, potencia radiativa (FRP) y temperatura infrarroja actualizada cada 24 horas.',
  
  keywords: [
    'incendios forestales Antioquia',
    'monitoreo térmico satelital Colombia',
    'NASA FIRMS Colombia',
    'detección incendios Cañón del Cauca',
    'mapa incendios forestales Colombia',
    'alertas térmicas VIIRS',
    'monitoreo ambiental Antioquia',
    'focos de calor occidente antioqueño',
    'potencia radiativa fuego FRP',
    'prevención incendios forestales',
    'Sistema de Alerta Temprana',
    'gestión del riesgo Antioquia',
    'temperatura infrarroja incendios',
    'satélite VIIRS NOAA',
    'Ooasys Directorio'
  ],

  authors: [{ 
    name: 'Ooasys',
    url: 'https://www.ooasys.com'
  }],
  
  creator: 'Ooasys',
  publisher: 'Ooasys',
  
  openGraph: {
    title: '🔴 Monitoreo Térmico Satelital — Incendios en Antioquia | Ooasys',
    description: 'Mapa interactivo con detección satelital de incendios forestales en el occidente antioqueño. Datos VIIRS NASA FIRMS actualizados. Potencia radiativa (FRP), temperatura infrarroja y niveles de confianza.',
    url: 'https://www.ooasys.com/incendios',
    siteName: 'Ooasys',
    images: [
      {
        url: 'https://www.ooasys.com/og-monitoreo-termico.jpg',
        width: 1200,
        height: 630,
        alt: 'Mapa interactivo de incendios forestales en Antioquia Colombia - Monitoreo Satelital VIIRS | Ooasys',
        type: 'image/jpeg'
      }
    ],
    locale: 'es_CO',
    type: 'website',
   
  },

  twitter: {
    card: 'summary_large_image',
    site: '@Ooasys',
    creator: '@Ooasys',
    title: '🔴 Monitoreo Térmico Satelital — Incendios Forestales Antioquia | Ooasys',
    description: 'Focos de calor detectados en tiempo real por satélite VIIRS NASA. Mapa interactivo con datos de potencia radiativa (FRP) y temperatura infrarroja.',
    images: {
      url: 'https://www.ooasys.com/og-monitoreo-termico.jpg',
      alt: 'Mapa de incendios forestales detectados por satélite en Antioquia | Ooasys'
    }
  },

  alternates: {
    canonical: 'https://www.ooasys.com/incendios',
    languages: {
      'es-CO': 'https://www.ooasys.com/incendios',
      'es': 'https://www.ooasys.com/es/incendios'
    }
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false
    }
  },

  verification: {
    google: 'tu-google-verification-code',
  },

  appleWebApp: {
    title: 'Monitoreo Térmico - Ooasys',
    statusBarStyle: 'black-translucent'
  },

  category: 'Monitoreo Ambiental',
  classification: 'Gestión del Riesgo de Desastres',
};

export default function IncendiosPage() {
  return <IncendiosMapClient />;
}