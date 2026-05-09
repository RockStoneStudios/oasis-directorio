import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
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
import type { LoadedSanityImage } from "@/types";
import { ImageGallery } from "@/components/property/ImageGallery";

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado",
    };
  }

  const description =
    business.description ||
    `Informacion, horarios y contacto de ${business.name}.`;

  return {
    title: business.name,
    description,
    openGraph: {
      title: business.name,
      description,
      images: business.logo?.asset?.url ? [business.logo.asset.url] : [],
    },
  };
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

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

  return (
    <div>
      <header className="border-b border-border/50 bg-accent/30">
        <div className="container py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
              {business.logo?.asset ? (
                <Image
                  src={urlFor(business.logo).width(240).height(240).url()}
                  alt={business.logo.alt || business.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Store
                    className="h-10 w-10 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {business.category?.name && (
                  <Badge variant="outline">{business.category.name}</Badge>
                )}
                {business.municipality?.name && (
                  <Badge variant="secondary">{business.municipality.name}</Badge>
                )}
                {business.isFeatured && <Badge>Destacado</Badge>}
              </div>
              <h1 className="text-3xl font-bold font-heading md:text-5xl">
                {business.name}
              </h1>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <RatingStars rating={business.rating} />
                {normalized.addressLabel && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>{normalized.addressLabel}</span>
                  </div>
                )}
              </div>
            </div>
            <WhatsAppButton
              phone={business.whatsapp}
              businessName={business.name}
            />
          </div>
        </div>
      </header>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-10">
            {/* <Gallery
              businessName={business.name}
              images={business.gallery || []}
            /> */}
            <ImageGallery
  images={business.gallery || []}
  title={business.name}
/>

            <section className="rounded-2xl border border-border/50 bg-background p-6 shadow-warm">
              <h2 className="text-2xl font-bold font-heading">
                Sobre el negocio
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {business.description ||
                  "Este negocio aun no tiene descripcion."}
              </p>
            </section>

            <Map
              location={business.location}
              title={business.name}
              address={formatAddress(business.address)}
            />
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border/50 bg-background p-6 shadow-warm">
              <h2 className="mb-5 text-xl font-bold font-heading">Contacto</h2>
              <div className="space-y-3">
                {business.phone && (
                  <ContactLink href={`tel:${business.phone}`} icon={<Phone />}>
                    {business.phone}
                  </ContactLink>
                )}
                {business.website && (
                  <ContactLink
                    href={business.website}
                    icon={<Globe />}
                    external
                  >
                    Sitio web
                  </ContactLink>
                )}
                {business.facebook && (
                  <ContactLink
                    href={business.facebook}
                    icon={<Facebook />}
                    external
                  >
                    Facebook
                  </ContactLink>
                )}
                {business.instagram && (
                  <ContactLink
                    href={business.instagram}
                    icon={<Instagram />}
                    external
                  >
                    Instagram
                  </ContactLink>
                )}
              </div>
              <WhatsAppButton
                phone={business.whatsapp}
                businessName={business.name}
              />
            </section>

            <BusinessHours hours={business.hours} />
          </aside>
        </div>

        {relatedBusinesses.length > 0 && (
          <section className="mt-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-heading">
                  Negocios relacionados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Mas opciones en la misma zona o categoria.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link
                  href={`/business?category=${categorySlug}&municipality=${municipalitySlug}`}
                >
                  Ver mas
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBusinesses.map((item) => (
                <BusinessCard key={item._id} business={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <WhatsAppButton
        phone={business.whatsapp}
        businessName={business.name}
        floating
      />
    </div>
  );
}

function Gallery({
  businessName,
  images,
}: {
  businessName: string;
  images: LoadedSanityImage[];
}) {
  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        Galeria no disponible
      </div>
    );
  }

  const [first, ...rest] = images;

  return (
    <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-warm">
        <Image
          src={urlFor(first).width(1200).height(675).url()}
          alt={first.alt || businessName}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
        {rest.slice(0, 2).map((image, index) => (
          <div
            key={image.asset?._id || index}
            className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-warm"
          >
            <Image
              src={urlFor(image).width(600).height(338).url()}
              alt={image.alt || `${businessName} ${index + 2}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
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
    <Button variant="outline" className="w-full justify-start" asChild>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {icon}
        <span>{children}</span>
        {external && (
          <ExternalLink className="ml-auto h-4 w-4" aria-hidden="true" />
        )}
      </a>
    </Button>
  );
}
