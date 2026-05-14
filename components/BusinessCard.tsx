import { CheckCircle2, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import {
  formatAddress,
  getBusinessHref,
  getSlugValue,
} from "@/lib/formatBusinessData";
import { urlFor } from "@/lib/sanity/image";
import type { BusinessCardData } from "@/types/business";

interface BusinessCardProps {
  business: BusinessCardData;
}export function BusinessCard({ business }: BusinessCardProps) {
  const href = getBusinessHref(business);
  const categorySlug = getSlugValue(business.category?.slug);
  const municipalitySlug = getSlugValue(business.municipality?.slug);

  return (
    <Link href={href} className="group block">
      {/* Reducido border-radius y padding general */}
      <article className="h-full overflow-hidden rounded-lg border border-border/50 bg-card text-card-foreground shadow-warm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
        
        {/* LOGO: Reducción del aspect ratio y dimensiones de Sanity */}
        <div className="relative aspect-video bg-muted"> {/* Cambiado de 4/3 a video para ser más compacto */}
          {business.logo?.asset ? (
            <Image
              // Reducción del 20% en la resolución solicitada (500x375 -> 400x300)
              src={urlFor(business.logo).width(400).height(300).url()}
              alt={business.logo.alt || business.name}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {/* Icono de reemplazo más pequeño (h-9 -> h-7) */}
              <Store className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
            </div>
          )}

          {/* Badges superiores más compactos */}
          <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1">
            {business.isFeatured && <Badge className="text-[10px] py-0 px-1.5">Destacado</Badge>}
            {(business.isVerified || business.status === "open") && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                <CheckCircle2 className="h-2 w-2" aria-hidden="true" />
                Verificado
              </Badge>
            )}
          </div>
        </div>

        {/* CONTENIDO: Reducción de padding (p-4 -> p-3) y espaciado (space-y-2.5 -> space-y-2) */}
        <div className="space-y-2 p-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              {/* Título más pequeño (text-base -> text-sm) */}
              <h3 className="line-clamp-2 text-sm font-bold font-heading">
                {business.name}
              </h3>
              {/* Ajuste de escala para las estrellas */}
              <div className="scale-90 origin-right">
                <RatingStars rating={business.rating} showValue={false} />
              </div>
            </div>
            {business.description && (
              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {business.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {business.category?.name && (
              <Badge variant="outline" asChild className="text-[10px] py-0 px-1.5">
                <span>{business.category.name}</span>
              </Badge>
            )}
            {business.municipality?.name && (
              <Badge variant="muted" asChild className="text-[10px] py-0 px-1.5">
                <span>{business.municipality.name}</span>
              </Badge>
            )}
          </div>

          {(formatAddress(business.address) || categorySlug || municipalitySlug) && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5 flex-shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">
                {formatAddress(business.address) ||
                  [business.category?.name, business.municipality?.name]
                    .filter(Boolean)
                    .join(" en ")}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}