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
}

export function BusinessCard({ business }: BusinessCardProps) {
  const href = getBusinessHref(business);
  const categorySlug = getSlugValue(business.category?.slug);
  const municipalitySlug = getSlugValue(business.municipality?.slug);

  return (
    <Link href={href} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-warm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
        <div className="relative aspect-[4/3] bg-muted">
          {business.logo?.asset ? (
            <Image
              src={urlFor(business.logo).width(640).height(480).url()}
              alt={business.logo.alt || business.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Store className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {business.isFeatured && <Badge>Destacado</Badge>}
            {(business.isVerified || business.status === "open") && (
              <Badge variant="secondary">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Verificado
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-xl font-bold font-heading">
                {business.name}
              </h3>
              <RatingStars rating={business.rating} showValue={false} />
            </div>
            {business.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {business.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {business.category?.name && (
              <Badge variant="outline" asChild>
                <span>{business.category.name}</span>
              </Badge>
            )}
            {business.municipality?.name && (
              <Badge variant="muted" asChild>
                <span>{business.municipality.name}</span>
              </Badge>
            )}
          </div>

          {(formatAddress(business.address) || categorySlug || municipalitySlug) && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
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
