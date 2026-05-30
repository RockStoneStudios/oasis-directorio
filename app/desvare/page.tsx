export const dynamic = "force-dynamic";

import { AlertCircle, Clock, Phone, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { DESVARE_DIRECTORY_QUERY } from "@/lib/sanity/queries";
import { isBusinessOpen } from "@/lib/hoursValidator";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";

// ============================================================
// TIPOS
// ============================================================

interface Business {
  _id: string;
  name: string;
  status?: string; // Sincronizado para atrapar el estado 'alwaysopen'
  slug: { current: string };
  description?: string;
  hours: any;
  whatsapp: string;
  phone?: string;
  logo?: {
    asset: any;
    alt?: string;
  };
  category?: {
    name: string;
  };
  municipality?: {
    name: string;
  };
}

type GroupedCategories = Record<string, Business[]>;

// ============================================================
// METADATA & CONFIG
// ============================================================

export const metadata = {
  title: "El Desvare 24/7 | Oasis Sopetrán",
  description: "Encuentra farmacias, montallantas, médicos y restaurantes abiertos en este preciso instante en Sopetrán y San Jerónimo.",
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default async function DesvarePage() {
  const businesses = await client.fetch(DESVARE_DIRECTORY_QUERY) as Business[];
  
  // Se le inyecta tanto el campo de horas como el status de forma segura al validador
  const openBusinesses = businesses.filter(business => 
    isBusinessOpen(business.hours, business.status)
  );
  
  const groupedCategories = openBusinesses.reduce<GroupedCategories>((acc, business) => {
    const categoryName = business.category?.name ?? "Otros Servicios";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(business);
    return acc;
  }, {});

  return (
    <div className="container px-4 py-8 sm:py-12">
      <Header />
      
      {openBusinesses.length === 0 ? (
        <EmptyState />
      ) : (
        <CategoriesList groupedCategories={groupedCategories} />
      )}
    </div>
  );
}

// ============================================================
// COMPONENTES SECUNDARIOS (optimización)
// ============================================================

function Header() {
  return (
    <header className="mb-10 text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-4 text-xs font-semibold uppercase tracking-wider">
        <AlertCircle className="h-4 w-4" /> 
        Servicio de Emergencia Vial y Comercial
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight text-foreground">
        El Desvare <span className="text-primary">24/7</span>
      </h1>
      <p className="mt-3 text-muted-foreground text-sm sm:text-base">
        ¿Varado, con hambre nocturna o una emergencia médica? Aquí tienes los comercios del Occidente Antioqueño que están <strong className="text-foreground">abiertos e instalados para atenderte ya mismo</strong>.
      </p>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 rounded-2xl border border-dashed border-border p-8 bg-accent/20">
      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
      <h3 className="text-lg font-bold">No hay comercios abiertos en este momento</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
        Es un horario de baja actividad. Si tienes una urgencia extrema, contacta directamente a las líneas de emergencia del municipio.
      </p>
    </div>
  );
}

function CategoriesList({ groupedCategories }: { groupedCategories: GroupedCategories }) {
  return (
    <div className="space-y-12">
      {Object.entries(groupedCategories).map(([categoryName, items]) => (
        <CategorySection key={categoryName} categoryName={categoryName} items={items} />
      ))}
    </div>
  );
}

function CategorySection({ categoryName, items }: { categoryName: string; items: Business[] }) {
  return (
    <section aria-labelledby={`cat-${categoryName}`}>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-6">
        <h2 id={`cat-${categoryName}`} className="text-xl sm:text-2xl font-bold font-heading text-foreground">
          {categoryName}
        </h2>
        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 font-mono text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          {items.length} {items.length === 1 ? "abierto" : "abiertos"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>
    </section>
  );
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-border/50 bg-background p-5 shadow-warm transition-all hover:border-primary/30 hover:shadow-md">
      <div>
        <div className="flex gap-4 items-start">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-accent/30">
            {business.logo?.asset ? (
              <Image
                src={urlFor(business.logo).width(120).height(120).url()}
                alt={business.logo.alt || business.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Store className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Atendiendo ahora
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-foreground mt-0.5 group-hover:text-primary transition-colors line-clamp-1">
              <Link href={`/business/${business.slug?.current}`}>
                {business.name}
              </Link>
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {business.municipality?.name ?? "Occidente Antioqueño"}
            </p>
          </div>
        </div>

        <p className="mt-3.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {business.description ?? "Este establecimiento se encuentra prestando atención inmediata. Ponte en contacto para verificar disponibilidad de domicilios."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-2">
        <div className="flex-1">
          <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
        </div>
        {business.phone && (
          <Button size="icon" variant="outline" className="rounded-xl shrink-0 h-10 w-10" asChild title="Llamar directamente">
            <a href={`tel:${business.phone}`}>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}