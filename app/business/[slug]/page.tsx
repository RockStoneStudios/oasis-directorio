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
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";

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
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatAddress,
  getSlugValue,
  normalizeBusinessData,
} from "@/lib/formatBusinessData";
import { urlFor } from "@/lib/sanity/image";
import { ImageGallery } from "@/components/business/ImageGallery";

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Configuración de los íconos y textos amigables según el valor del Array de Sanity
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
    icon: <Waves className="h-4 w-4 text-cyan-500" />, // Reutiliza icono de agua fluyendo
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20"
  },
};

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Oasis",
    };
  }

  const businessName = business.name;
  const category = business.category?.name || "Comercio";
  const municipality = business.municipality?.name || "Antioquia";
  
  const seoTitle = `${businessName} en ${municipality} | ${category} | Oasis`;
  const seoDescription = business.description 
    ? `${business.description.slice(0, 150)}... Encuentra opiniones, ubicación, horarios y contacto directo vía WhatsApp en Oasis.`
    : `Contacta con ${businessName} en ${municipality}. Información detallada de este establecimiento de ${category}, ubicación en mapa, teléfonos y horarios de atención en el directorio local Oasis.`;

  const imageUrl = business.logo?.asset?.url || "/fallback-og.png";

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://oasis-directorio-ccg7.vercel.app/business/${slug}`,
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
      url: `https://oasis-directorio-ccg7.vercel.app/business/${slug}`,
      siteName: "Oasis Directorio Local",
      locale: "es_CO",
      type: "video.other",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Ficha comercial de ${businessName} en Oasis`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
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

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-border/50 bg-accent/30">
        <div className="container px-4 py-6 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Logo */}
            <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
              {business.logo?.asset ? (
                <Image
                  src={urlFor(business.logo).width(240).height(240).url()}
                  alt={business.logo.alt || `Logo oficial de ${business.name}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Store className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap gap-2">
                {business.category?.name && (
                  <Badge variant="outline">{business.category.name}</Badge>
                )}
                {business.municipality?.name && (
                  <Badge variant="secondary">{business.municipality.name}</Badge>
                )}
                {business.isFeatured && <Badge>Destacado</Badge>}
              </div>
              
              <h1 className="text-2xl font-bold font-heading sm:text-3xl md:text-5xl leading-tight text-foreground">
                {business.name}
              </h1>
              
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <RatingStars rating={business.rating} />
                {normalized.addressLabel && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{normalized.addressLabel}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              <WhatsAppButton
                phone={business.whatsapp}
                businessName={business.name}
              />
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <WhatsAppButton
              phone={business.whatsapp}
              businessName={business.name}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="container px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main content */}
          <div className="space-y-8">
            <ImageGallery
              images={business.gallery || []}
              title={business.name}
            />

            <section aria-labelledby="about-heading" className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
              <h2 id="about-heading" className="text-xl sm:text-2xl font-bold font-heading">
                Sobre {business.name}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground text-sm sm:text-base">
                {business.description || `Encuentra los mejores productos y servicios de ${business.name} en nuestro directorio local actualizado.`}
              </p>
            </section>

            {/* 👇 NUEVA SECCIÓN DE AMENITIES EN EL FRONTEND 👇 */}
           {/* SECCIÓN DE AMENITIES CORREGIDA Y 100% RESPONSIVA */}
{business.amenities && business.amenities.length > 0 && (
  <section aria-labelledby="amenities-heading" className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
    <h2 id="amenities-heading" className="text-xl sm:text-2xl font-bold font-heading mb-4">
      Servicios y Comodidades
    </h2>
    
    {/* Usamos flex flex-wrap con un gap controlado para que se adapte dinámicamente a cualquier pantalla */}
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
            <span className="whitespace-nowrap">{amenity.label}</span>
          </div>
        );
      })}
    </div>
  </section>
)}

            <section aria-label="Ubicación en el mapa" className="h-80 w-full overflow-hidden rounded-2xl">
              <Map
                location={business.location}
                title={business.name}
                address={formatAddress(business.address)}
              />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <section aria-labelledby="contact-heading" className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
              <h2 id="contact-heading" className="mb-4 text-lg sm:text-xl font-bold font-heading">Contacto Directo</h2>
              <div className="space-y-3">
                {business.phone && (
                  <ContactLink href={`tel:${business.phone}`} icon={<Phone className="h-4 w-4" />}>
                    {business.phone}
                  </ContactLink>
                )}
                {business.website && (
                  <ContactLink href={business.website} icon={<Globe className="h-4 w-4" />} external>
                    Sitio web oficial
                  </ContactLink>
                )}
                {business.facebook && (
                  <ContactLink
                    href={business.facebook}
                    icon={<SiFacebook className="h-4 w-4 text-[#1877F2]" />}
                    external
                  >
                    Perfil de Facebook
                  </ContactLink>
                )}
                {business.instagram && (
                  <ContactLink
                    href={business.instagram}
                    icon={<SiInstagram className="h-4 w-4 text-[#E4405F]" />}
                    external
                  >
                    Perfil de Instagram
                  </ContactLink>
                )}
                {business.tiktok && (
                  <ContactLink
                    href={business.tiktok}
                    icon={<SiTiktok className="h-4 w-4 text-foreground text-[#000000] dark:text-[#FFFFFF]" />} // Icono corregido y colores adaptables
                    external
                  >
                    Perfil de TikTok
                  </ContactLink>
                )}
              </div>
              <div className="mt-4">
                <WhatsAppButton
                  phone={business.whatsapp}
                  businessName={business.name}
                />
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
          <section aria-labelledby="related-heading" className="mt-12 sm:mt-16">
            <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 id="related-heading" className="text-xl sm:text-2xl font-bold font-heading">
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

      <WhatsAppButton
        phone={business.whatsapp}
        businessName={business.name}
        floating
      />
    </div>
  );
}

function ContactLink({
  href,
  icon,
  children,
  external = false,
}: {
  href: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Button variant="outline" className="w-full justify-start text-sm gap-3 px-4" asChild>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {icon}
        <span className="truncate flex-1 text-left">{children}</span>
        {external && (
          <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
        )}
      </a>
    </Button>
  );
}