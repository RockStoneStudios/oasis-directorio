import {
  AirVent,
  Briefcase,
  Car,
  CheckCircle2,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Plug,
  Store,
  Waves,
  Wifi,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/actions/getBusinessBySlug";
import { getBusinesses } from "@/actions/getBusinesses";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessHours } from "@/components/BusinessHours";
import { Map } from "@/components/Map";
import { RatingStars } from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatAddress,
  getSlugValue,
  normalizeBusinessData,
  generateWhatsAppUrl,
} from "@/lib/formatBusinessData";
import { urlFor } from "@/lib/sanity/image";
import { ImageGallery } from "@/components/business/ImageGallery";

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

const AMENITY_MAP: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pet_friendly: {
    label: "🐾 Pet Friendly",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
  },
  air_conditioning: {
    label: "Aire Acondicionado / Ventilador",
    icon: <AirVent className="h-4 w-4 text-sky-500" />,
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
  },
  free_wifi: {
    label: "Wi-Fi Gratis",
    icon: <Wifi className="h-4 w-4 text-indigo-500" />,
    className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
  },
  coworking: {
    label: "Espacio de Trabajo (Coworking)",
    icon: <Briefcase className="h-4 w-4 text-amber-500" />,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
  },
  power_outlets: {
    label: "Tomacorrientes Accesibles",
    icon: <Plug className="h-4 w-4 text-purple-500" />,
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
  },
  private_parking: {
    label: "Parqueadero Privado",
    icon: <Car className="h-4 w-4 text-blue-500" />,
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
  },
  pool_access: {
    label: "Acceso a Piscina / Pasadía",
    icon: <Waves className="h-4 w-4 text-teal-500" />,
    className: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20"
  },
  water_tank: {
    label: "Tanque de Reserva de Agua",
    icon: <Waves className="h-4 w-4 text-cyan-500" />,
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20"
  },
};

// 🌟 Clases de efectos neon y pulso
const neonPulseClasses = {
  phone: "animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6),0_0_16px_rgba(34,197,94,0.4)] hover:shadow-[0_0_12px_rgba(34,197,94,0.8),0_0_20px_rgba(34,197,94,0.6)]",
  web: "animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6),0_0_16px_rgba(59,130,246,0.4)] hover:shadow-[0_0_12px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.6)]",
  facebook: "animate-pulse shadow-[0_0_8px_rgba(24,119,242,0.6),0_0_16px_rgba(24,119,242,0.4)] hover:shadow-[0_0_12px_rgba(24,119,242,0.8),0_0_20px_rgba(24,119,242,0.6)]",
  instagram: "animate-pulse shadow-[0_0_8px_rgba(228,64,95,0.6),0_0_16px_rgba(228,64,95,0.4)] hover:shadow-[0_0_12px_rgba(228,64,95,0.8),0_0_20px_rgba(228,64,95,0.6)]",
  tiktok: "animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.6),0_0_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_12px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.6)]",
  whatsapp: "animate-pulse shadow-[0_0_8px_rgba(37,211,102,0.6),0_0_16px_rgba(37,211,102,0.4)] hover:shadow-[0_0_12px_rgba(37,211,102,0.8),0_0_20px_rgba(37,211,102,0.6)]",
};

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Ooasys",
      robots: { index: false },
    };
  }

  const businessName = business.name;
  const category = business.category?.name || "Comercio";
  const municipality = business.municipality?.name || "Antioquia";
  const description = business.description || `Información y contacto de ${businessName} en ${municipality}.`;
  
  const keywords = [
    businessName,
    category,
    municipality,
    `${businessName} ${municipality}`,
    `${category} en ${municipality}`,
    business.address,
    business.phone,
    business.whatsapp,
    "directorio local",
    "negocios cerca de mí",
    "ooasys",
  ].filter(Boolean).join(", ");

  const seoTitle = `${businessName} | ${category} en ${municipality} | Teléfono y Horarios | Ooasys`;
  const seoDescription = `${businessName} en ${municipality}. ${description.slice(0, 150)} Ubicación, teléfono ${business.phone || ""}, horarios y contacto.`;

  const imageUrl = business.logo?.asset?.url || "https://www.ooasys.com/ooasys.webp";

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    authors: [{ name: "Ooasys", url: "https://www.ooasys.com" }],
    alternates: {
      canonical: `https://www.ooasys.com/business/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://www.ooasys.com/business/${slug}`,
      siteName: "Ooasys",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${businessName} - ${category} en ${municipality}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
      creator: "@ooasys",
      site: "@ooasys",
    },
  };
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  console.log("************************",business);
  if (!business) notFound();

  const normalized = normalizeBusinessData(business);
  const categorySlug = getSlugValue(business.category?.slug);
  const municipalitySlug = getSlugValue(business.municipality?.slug);

  const { businesses: related } = await getBusinesses({
    category: categorySlug,
    municipality: municipalitySlug,
    pageSize: 5,
  });

  const relatedBusinesses = related
    .filter((item) => item._id !== business._id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `Información de contacto de ${business.name}`,
    "url": `https://oasis-directorio-ccg7.vercel.app/business/${slug}`,
    "telephone": business.phone || business.whatsapp || "",
    "priceRange": "$$",
    "image": business.logo?.asset?.url || [],
    ...(business.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": business.rating,
        "reviewCount": "1",
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": normalized.addressLabel || "Dirección conocida",
      "addressLocality": business.municipality?.name || "Antioquia",
      "addressCountry": "CO"
    },
    ...(business.location?.lat && business.location?.lng && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": business.location.lat,
        "longitude": business.location.lng
      }
    })
  };

  // Formatear WhatsApp
  const formatColombiaPhone = (rawPhone: string | null | undefined) => {
    if (!rawPhone) return null;
    const cleaned = rawPhone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `57${cleaned}`;
    }
    return cleaned;
  };

  const whatsappUrl = business.whatsapp ? generateWhatsAppUrl(
    formatColombiaPhone(business.whatsapp),
    `Hola, vi ${business.name} en Oasis y quiero más información.`,
  ) : null;

  // Contar cuántos íconos hay (incluyendo WhatsApp)
  const totalIcons = [
    business.phone,
    business.website,
    business.facebook,
    business.instagram,
    business.tiktok,
    business.whatsapp,
  ].filter(Boolean).length;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header estilo perfil profesional */}
      <div className="relative">
        <div className="absolute inset-0 h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-b-3xl -z-10" />
        
        <div className="container px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo circular */}
            <div className="relative h-28 w-28 md:h-36 md:w-36 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white">
              {business.logo?.asset ? (
                <Image
                  src={urlFor(business.logo).width(240).height(240).url()}
                  alt={business.logo.alt || `Logo oficial de ${business.name}`}
                  fill
                  sizes="144px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Store className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Info principal */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                {business.category?.name && (
                  <Badge variant="outline">{business.category.name}</Badge>
                )}
                {business.municipality?.name && (
                  <Badge variant="secondary">{business.municipality.name}</Badge>
                )}
                {business.isFeatured && <Badge>Destacado</Badge>}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold font-heading text-foreground">
                {business.name}
              </h1>
              
              <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
                <RatingStars rating={business.rating} />
                {normalized.addressLabel && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>{normalized.addressLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ya no va el WhatsAppButton aquí porque estará en la fila de íconos */}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Columna izquierda */}
          <div className="space-y-8">
            <ImageGallery
              images={business.gallery || []}
              title={business.name}
            />

            <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
              <h2 className="text-xl sm:text-2xl font-bold font-heading">
                Sobre {business.name}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground text-sm sm:text-base">
                {business.description || `Encuentra los mejores productos y servicios de ${business.name} en nuestro directorio local actualizado.`}
              </p>
            </section>

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
                <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4">
                  Servicios y Comodidades
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {business.amenities.map((slug) => {
                    const amenity = AMENITY_MAP[slug];
                    if (!amenity) return null;
                    return (
                      <div
                        key={slug}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors ${amenity.className}`}
                      >
                        <div className="shrink-0 scale-95 sm:scale-100">{amenity.icon}</div>
                        <span>{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="h-80 w-full overflow-hidden rounded-2xl">
              <Map
                location={business.location}
                title={business.name}
                address={formatAddress(business.address)}
              />
            </section>
          </div>

          {/* Sidebar - ÍCONOS EN UNA SOLA FILA HORIZONTAL (WHATSAPP INCLUIDO) */}
          <aside className="space-y-5">
            <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
              {/* Contenedor con grid para forzar UNA SOLA FILA */}
              <div className={`grid grid-cols-${totalIcons} gap-3 justify-items-center`}>
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.phone}`}
                    title="Teléfono"
                  >
                    <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.web}`}
                    title="Sitio web"
                  >
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </a>
                )}
                {business.facebook && (
                  <a
                    href={business.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.facebook}`}
                    title="Facebook"
                  >
                    <SiFacebook className="h-6 w-6 text-[#1877F2]" />
                  </a>
                )}
                {business.instagram && (
                  <a
                    href={business.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.instagram}`}
                    title="Instagram"
                  >
                    <SiInstagram className="h-6 w-6 text-[#E4405F]" />
                  </a>
                )}
                {business.tiktok && (
                  <a
                    href={business.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.tiktok}`}
                    title="TikTok"
                  >
                    <SiTiktok className="h-6 w-6 text-gray-900 dark:text-white" />
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 justify-self-center ${neonPulseClasses.whatsapp}`}
                    title="WhatsApp"
                  >
                    <SiWhatsapp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </a>
                )}
              </div>
            </section>

            <BusinessHours
              hours={business.hours ?? []}
              isAlwaysOpen={business.hours?.some((h: any) => h.isOpen === true && !h.day)}
            />
          </aside>
        </div>

        {/* Negocios relacionados */}
        {relatedBusinesses.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading">
                  Otros establecimientos recomendados
                </h2>
                <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">
                  Más opciones similares en {business.municipality?.name || "la zona"}.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/business?category=${categorySlug}&municipality=${municipalitySlug}`}>
                  Ver todo
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBusinesses.map((item) => (
                <BusinessCard key={item._id} business={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}